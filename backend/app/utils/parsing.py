import fitz
import re
import nltk
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

# Auto-download punkt if not available
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")

def read_pdf_to_text(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9.,;:\n\s/-]", "", text)
    return text.strip()

def summarize_text(text: str, sentence_count: int = 3) -> str:
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentence_count)
    return " ".join(str(sentence) for sentence in summary)

def parse_cv_sections(cv_text: str) -> dict:
    sections = {"description": "", "skills": "", "education_and_experience": ""}
    text = cv_text.lower()

    # Parsing description (summary/profile)
    try:
        sections["description"] = summarize_text(cv_text)
    except Exception:
        match = re.search(
            r"(summary|profile)\s*[:\-]?\s*(.*?)(skills|education|experience|projects)",
            text,
            re.DOTALL,
        )
        if match:
            sections["description"] = match.group(2).strip()

    # Improved Parsing of Skills Section
    skills_keywords = [
        "skills", "technical skills", "professional skills", "key skills",
        "core skills", "core competencies", "competencies", "proficiencies",
        "expertise", "tools", "technologies", "technology stack"
    ]
    following_sections = [
        "education", "certifications", "projects", "experience",
        "work experience", "academic background", "employment history"
    ]
    skills_pattern = rf"({'|'.join(skills_keywords)})\s*[:\-]?\s*(.*?)(?:{'|'.join(following_sections)})"
    match = re.search(skills_pattern, text, re.DOTALL)

    if match:
        raw_skills_text = match.group(2).strip()
        potential_skills = re.split(r"[\n•,\-\*;]+", raw_skills_text)
        cleaned_skills = [s.strip() for s in potential_skills if 2 <= len(s.strip()) <= 50]
        sections["skills"] = ", ".join(cleaned_skills)

    # Parsing education and experience
    edu_pattern = r"(education|academic background|educational background)\s*[:\-]?\s*(.*)"
    match = re.search(edu_pattern, text, re.DOTALL)
    if match:
        edu_text = match.group(2).strip()
        edu_parts = re.split(
            r"(experience|work history|professional background|employment history)",
            edu_text,
        )
        sections["education_and_experience"] = edu_parts[0].strip()
        if len(edu_parts) > 1:
            sections["education_and_experience"] += "\n" + edu_parts[1].strip()

    return sections
