from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.utils.parsing import read_pdf_to_text, clean_text, parse_cv_sections
from app.utils.matching import Matcher

matcher = Matcher("app/data/dataset.csv", "app/data/job_embeddings.npy")

app = FastAPI(title="CuViQ")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/match_cv/")
async def match_cv(cv_file: UploadFile = File(...)):
    if not cv_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    cv_bytes = await cv_file.read()
    raw_text = read_pdf_to_text(cv_bytes)
    cleaned_text = clean_text(raw_text)
    parsed = parse_cv_sections(cleaned_text)

    full_text = " ".join([
        parsed["description"] or "No summary provided.",
        parsed["skills"] or "No skills listed.",
        parsed["education_and_experience"] or "No education or experience listed."
    ])

    top_matches = matcher.match(full_text)

    return JSONResponse(content={
        "parsed_sections": parsed,
        "top_matches": [
            {
                "job_title": row["job_title"],
                "job_description": row["descriptions"][:300],
                "match_percentage": float(row["match_percentage"])
            }
            for _, row in top_matches.iterrows()
        ]
    })
