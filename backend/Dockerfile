FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NLTK_DATA=/app/data

WORKDIR /app

# Install system dependencies needed for building Python packages and curl (optional)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Create the NLTK_DATA folder (for NLTK to store data)
RUN mkdir -p /app/data

# Download punkt tokenizer inside the image at build time
RUN python -m nltk.downloader -d /app/data punkt

# Copy your app code (including any pre-downloaded data in ./app/data)
COPY ./app ./app

# Run the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
