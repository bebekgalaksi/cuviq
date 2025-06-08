from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import SessionLocal, init_db, User, ModelResult
from app.utils.parsing import read_pdf_to_text, clean_text, parse_cv_sections
from app.utils.matching import Matcher
from app.schemas import UserCreate, UserOut, UserLogin, MatchResponse, ResultsResponse

# Inisialisasi DB & model pencocokan
init_db()
matcher = Matcher("app/data/dataset.csv", 100)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Inisialisasi aplikasi FastAPI
app = FastAPI(title="CuViQ")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency untuk DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ==========================================================
# Endpoint: REGISTER
@app.post("/register", response_model=UserOut)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ==========================================================
# Endpoint: LOGIN
@app.post("/login/", response_model=UserOut)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.name == credentials.name).first()
    if not db_user or not pwd_context.verify(credentials.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    return db_user

# ==========================================================
# Endpoint: UPLOAD + MATCHING
@app.post("/match_cv/", response_model=MatchResponse)
async def match_cv(
    user_id: int = Form(...),
    cv_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validasi user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid user_id, user not found")

    # Validasi file
    if cv_file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        cv_bytes = await cv_file.read()
        raw_text = read_pdf_to_text(cv_bytes)
        cleaned_text = clean_text(raw_text)
        parsed = parse_cv_sections(cleaned_text)
        full_text = " ".join([
            parsed.get("description", "No summary provided."),
            parsed.get("skills", "No skills listed."),
            parsed.get("education_and_experience", "No education or experience listed.")
        ])

        # Lakukan pencocokan
        top_matches = matcher.match(full_text)

        # Simpan ke DB
        for _, row in top_matches.iterrows():
            db_result = ModelResult(
                user_id=user_id,
                match_percentage=float(row.get("match_percentage", 0)),
                job_title=row.get("job_title", "Unknown")
            )
            db.add(db_result)

        db.commit()

        return {
            "parsed_sections": parsed,
            "top_matches": [
                {
                    "job_title": row.get("job_title", "Unknown"),
                    "job_description": row.get("descriptions", "No description available.")[:300],
                    "match_percentage": float(row.get("match_percentage", 0))
                }
                for _, row in top_matches.iterrows()
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")

# ==========================================================
# Endpoint: GET RESULTS (riwayat pencocokan user)
@app.get("/results/{user_id}", response_model=ResultsResponse)
async def get_results(user_id: int, db: Session = Depends(get_db)):
    results = db.query(ModelResult).filter(ModelResult.user_id == user_id).all()
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return {"results": results}
