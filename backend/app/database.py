from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

DATABASE_URL = "postgresql://postgres:hasyidan123@db:5432/ATS_CHECKER"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Tabel User
class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    summary = Column(Text, nullable=True)
    password = Column(String, nullable=False)

    results = relationship("ModelResult", back_populates="user")

# Tabel Hasil Model
class ModelResult(Base):
    __tablename__ = "model_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.id")) 
    match_percentage = Column(Float)
    job_title = Column(String)

    user = relationship("User", back_populates="results")

# Inisialisasi tabel
def init_db():
    Base.metadata.create_all(bind=engine)