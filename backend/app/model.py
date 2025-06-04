from pydantic import BaseModel

class CVMatchResult(BaseModel):
    job_title: str
    job_description: str
    match_percentage: float

class CVParseResponse(BaseModel):
    description: str
    skills: str
    education_and_experience: str

class MatchResponse(BaseModel):
    parsed_sections: CVParseResponse
    top_matches: list[CVMatchResult]