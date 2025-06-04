import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class Matcher:
    def __init__(self, dataset_path: str, embedding_path: str):
        self.dataset_path = dataset_path

        self.df = pd.read_csv(dataset_path)
        self.texts = self.df["descriptions"].fillna("").astype(str).tolist()
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.texts)

    def match(self, text: str, top_k: int = 3):
        sections = [part.strip() for part in text.split("|||")]

        if len(sections) == 3:
            summary, skills, education_exp = sections
            weighted_text = (
                (summary + " ") * 2 +       # 20%
                (skills + " ") * 4 +        # 40%
                (education_exp + " ") * 4   # 40%
            )
        else:
            # If format not as expected, fallback to using text directly
            weighted_text = text

        # Compute similarity
        query_vector = self.vectorizer.transform([weighted_text])
        similarity_scores = cosine_similarity(query_vector, self.tfidf_matrix).flatten()

        # Get top K results
        top_indices = similarity_scores.argsort()[::-1][:top_k]
        results = self.df.iloc[top_indices].copy()
        results["match_percentage"] = (similarity_scores[top_indices] * 100).round(2)

        return results
