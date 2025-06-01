import fitz
import re

def read_pdf_to_text(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def clean_text(text: str) -> str:
    # Hilangkan spasi berlebih dan karakter aneh, hanya sisakan huruf, angka, dan beberapa simbol umum
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9.,;:\n\s/-]", "", text)
    return text.strip()

def parse_cv_sections(cv_text: str) -> dict:
    sections = {"description": "", "skills": "", "education_and_experience": ""}
    text = cv_text.lower()

    # Parsing description (summary/profile)
    match = re.search(r"(summary|profile)(.*?)(skills|education|experience)", text, re.DOTALL)
    if match:
        sections["description"] = match.group(2).strip()
    else:
        # fallback jika tidak ketemu, ambil kalimat pertama
        sections["description"] = text.split("\n")[0].strip()

    # Parsing skills
    match = re.search(r"skills[:\n\s]*(.*?)(education|experience|certifications)", text, re.DOTALL)
    if match:
        sections["skills"] = match.group(1).strip()

    # Parsing education dan experience
    match = re.search(r"(education|academic background|educational background)(.*)", text, re.DOTALL)
    if match:
        edu_text = match.group(2).strip()
        # Pisah antara education dan experience jika ada
        edu_parts = re.split(r"(experience|work history|professional background)", edu_text)
        sections["education_and_experience"] = edu_parts[0].strip()
        if len(edu_parts) > 1:
            sections["education_and_experience"] += "\n" + edu_parts[1].strip()

    return sections