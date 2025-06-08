import fitz
import re
import nltk
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer
from textblob import TextBlob
from nltk.tokenize import sent_tokenize
import os

# Path absolut ke folder 'data' (di luar app/, sesuai strukturmu)
NLTK_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

# Tambahkan ke path NLTK jika belum ada
if NLTK_DATA_PATH not in nltk.data.path:
    nltk.data.path.insert(0, NLTK_DATA_PATH)  # insert at front

# Pastikan tokenizer 'punkt' tersedia, jika tidak download otomatis ke folder data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', download_dir=NLTK_DATA_PATH)

def read_pdf_to_text(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()

def clean_text(text: str) -> str:
    text = re.sub(r'\b[\w\.-]+@[\w\.-]+\.\w+\b', '', text)
    text = re.sub(r'\b(?:\+?\d{1,3}[-.\s]?|\()?(\d{2,4})(\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})\b', '', text)
    text = re.sub(r"[^a-zA-Z0-9.,;:\n\s/-]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def auto_summary(text: str, sentences: int = 3) -> str:
    try:
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = TextRankSummarizer()
        summary = summarizer(parser.document, sentences)
        return " ".join(str(sentence) for sentence in summary)
    except Exception as e:
        print("SUMY ERROR:", e)
        try:
            return " ".join(str(s) for s in TextBlob(text).sentences[:sentences])
        except Exception as ex:
            print("TextBlob fallback error:", ex)
            return text

def parse_description(text: str) -> str:
    pattern = re.compile(
        r"""(?im)  # ignore case, multiline
        ^(summary|profile|overview|career summary|professional summary|about me)  # header
        \s*[:\-–]?\s*  # optional punctuation
        (.*?)  # lazy capture
        (?=^
            (skills|education|experience|projects|certifications|$)
        )
        """,
        re.DOTALL | re.VERBOSE
    )
    match = pattern.search(text)
    if match:
        desc_text = match.group(2).strip()
    else:
        sentences = sent_tokenize(text)
        desc_text = " ".join(sentences[:7])
    return auto_summary(desc_text, sentences=3)

def parse_skills(text: str) -> str:
    skills_keywords = [
        "skills", "technical skills", "expertise", "abilities", 
        "key skills", "competencies", "core skills", "professional skills"
    ]
    pattern = re.compile(
        rf"""(?im)
        ^({'|'.join(skills_keywords)})
        \s*[:\-–]?\s*
        (.*?)
        (?=^
            (education|experience|projects|certifications|summary|profile|$)
        )
        """,
        re.DOTALL | re.VERBOSE
    )
    match = pattern.search(text)
    if match:
        raw_skills = match.group(2).strip()
    else:
        # fallback cari bullet points dan daftar skill yang mungkin dipisah koma, baris baru, dll
        raw_skills = "\n".join(re.findall(r"[\n•\-\*\u2022]\s*([\w\s\+\#\.\-&]+)", text))
        if not raw_skills.strip():
            # fallback lain, cari kata skill di satu paragraf dan pisah koma
            possible_skills = re.findall(r"(skills[:\-–]?\s*)([a-zA-Z0-9\s,#+&.-]+)", text, flags=re.IGNORECASE)
            if possible_skills:
                raw_skills = possible_skills[0][1]

    # Pisah berdasarkan beberapa delimiter umum
    skills_list = re.split(r"[\n•,\-\*;]+", raw_skills)
    cleaned_skills = [s.strip() for s in skills_list if 2 <= len(s.strip()) <= 50]
    # Hapus duplikat dan kosong
    unique_skills = list(dict.fromkeys(filter(None, cleaned_skills)))
    return ", ".join(unique_skills) if unique_skills else "No skills listed"

def parse_education_and_experience(text: str) -> str:
    text_lower = text.lower()

    # Buat fallback deteksi kasar manual (berbasis teks asli)
    experience_section = ""
    education_section = ""

    # Coba potong berdasarkan header
    exp_match = re.search(r"(?i)experience\s*\n+(.*?)(?=\n+(skills|education|projects|$))", text, re.DOTALL)
    edu_match = re.search(r"(?i)education\s*\n+(.*?)(?=\n+(skills|experience|projects|$))", text, re.DOTALL)

    if exp_match:
        experience_section = exp_match.group(1).strip()
    if edu_match:
        education_section = edu_match.group(1).strip()

    result = []
    if experience_section:
        result.append("EXPERIENCE:\n" + experience_section)
    if education_section:
        result.append("EDUCATION:\n" + education_section)

    return "\n\n".join(result)


def parse_cv_sections(cv_text: str) -> dict:
    sections = {
        "description": parse_description(cv_text),
        "skills": parse_skills(cv_text),
        "education_and_experience": parse_education_and_experience(cv_text)
    }
    return sections
