from typing import List, Optional
from pydantic import BaseModel, EmailStr

# Schema untuk User input saat create user
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# Schema untuk User output (tanpa password)
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

# Schema untuk login input
class UserLogin(BaseModel):
    name: str
    password: str

# Schema untuk hasil pencocokan pekerjaan (match)
class MatchResult(BaseModel):
    job_title: str
    job_description: str
    match_percentage: float

# Schema untuk response hasil pencocokan
class MatchResponse(BaseModel):
    parsed_sections: dict
    top_matches: List[MatchResult]

# Schema untuk menyimpan hasil pencocokan di DB
class ModelResultOut(BaseModel):
    id: int
    user_id: int
    job_title: str
    match_percentage: float

    class Config:
        orm_mode = True

# Schema untuk response list hasil pencocokan berdasarkan user_id
class ResultsResponse(BaseModel):
    results: List[ModelResultOut]
