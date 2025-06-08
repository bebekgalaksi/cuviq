import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

class Matcher:
    def __init__(self, dataset_path: str, n_components: int = 100):
        self.df = pd.read_csv(dataset_path)
        self.texts = self.df["descriptions"].fillna("").astype(str).tolist()

        # TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = self.vectorizer.fit_transform(self.texts)

        # LSA: Truncated SVD
        self.svd = TruncatedSVD(n_components=n_components, random_state=42)
        self.lsa_matrix = self.svd.fit_transform(tfidf_matrix)

    def match(self, text: str, top_k: int = 3):
        sections = [part.strip() for part in text.split("|||")]

        if len(sections) == 3:
            summary, skills, education_exp = sections
            weighted_text = (
                (summary + " ") * 2 +
                (skills + " ") * 4 +
                (education_exp + " ") * 4
            )
        else:
            weighted_text = text

        # Transform CV input with the same TF-IDF vectorizer
        query_vector = self.vectorizer.transform([weighted_text])
        query_lsa = self.svd.transform(query_vector)

        # Hitung similarity LSA
        similarity_scores = cosine_similarity(query_lsa, self.lsa_matrix).flatten()
        top_indices = similarity_scores.argsort()[::-1][:top_k]
        
        results = self.df.iloc[top_indices].copy()
        results["match_percentage"] = (similarity_scores[top_indices] * 100).round(2)

        return results
