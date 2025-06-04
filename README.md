# Curriculum Vitae QU [CuViQ] - Job Recommendation Platform

JobMatch AI adalah platform cerdas yang membantu pencari kerja dengan menganalisis CV mereka dan memberikan rekomendasi pekerjaan yang dipersonalisasi menggunakan teknik NLP dan machine learning berbasis TF-IDF.

## 🔥 Fitur
- **Autentikasi Pengguna**: Registrasi, login, dan pengelolaan profil dengan FastAPI
- **Unggah CV**: Dukungan unggah PDF, yang disimpan dengan aman dan dikirim untuk analisis
- **Pemrosesan CV**: Ekstraksi informasi terstruktur (pendidikan, pengalaman, keterampilan) dari CV menggunakan NLP
- **Pencocokan Pekerjaan**: Menggunakan TF-IDF untuk vektorisasi dan perhitungan kesamaan guna merekomendasikan lowongan kerja yang paling sesuai
- **Penyimpanan Data**: Menyimpan data pengguna, file yang diunggah, dan hasil analisis untuk pengambilan kembali nanti
- **Arsitektur Modular**: Backend menggunakan FastAPI, manajemen basis data dengan PostgreSQL, dan frontend dengan React
- **Docker Containerization**: Menjalankan layanan backend dan database dalam kontainer Docker untuk skalabilitas dan kemudahan deployment

## ⚙️ Teknologi
| Lapisan            | Teknologi                          |
|--------------------|----------------------------------|
| Backend API       | FastAPI (Python)                 |
| Basis Data        | PostgreSQL                       |
| Pemrosesan CV     | PyMuPDF, NLTK, scikit-learn (TF-IDF) |
| Frontend         | ReactJS                           |
| Containerisasi   | Docker                            |

## 🛠️ Cara Memulai

### Prasyarat
- Python 3.11+
- Basis data PostgreSQL
- Node.js & npm (jika menjalankan frontend React)
- Docker untuk menjalankan backend dan database dalam kontainer

```bash
git clone https://github.com/username/Cuviq
cd Cuviq
docker-compose up -d

🧪 Penggunaan
- Registrasi dan login melalui autentikasi FastAPI
- Unggah CV dalam format PDF
- Backend mengirimkan CV ke FastAPI untuk parsing dan pencocokan pekerjaan
- Lihat bagian CV yang telah dianalisis dan rekomendasi pekerjaan terbaik
📈 Cara Kerjanya
- Unggah CV ATS mu dalam bentuk file dengan format PDF
- Model akan melakukan eksekusi dengan parsing menggunakan NLP untuk mengekstrak info relevan (pendidikan, pengalaman, keterampilan)
- Program akan melakukan vektorisasi Menggunakan metode TF-IDF untuk pemrosesan CV dan deskripsi pekerjaan
- Dilakukan pencocokan dengan menghitung kesamaan menggunakan cosine similarity untuk menemukan kecocokan terbaik
- Menyimpan dan mengirimkan data yang telah dianalisis serta rekomendasi pekerjaan kepada pengguna
