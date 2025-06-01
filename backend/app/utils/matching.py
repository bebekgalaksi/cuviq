import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import pandas as pd

class Matcher:
    def __init__(self, dataset_path: str, embedding_path: str):
        self.dataset_path = dataset_path
        self.embedding_path = embedding_path
        self.df = pd.read_csv(dataset_path)
        self.embeddings = np.load(embedding_path).astype("float32")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.IndexFlatIP(self.embeddings.shape[1])
        faiss.normalize_L2(self.embeddings)
        self.index.add(self.embeddings)

    def match(self, text: str, top_k: int = 3):
        embed = self.model.encode([text]).astype("float32")
        faiss.normalize_L2(embed)
        D, I = self.index.search(embed, k=top_k)
        results = self.df.iloc[I[0]].copy()
        results["match_percentage"] = (D[0] * 100).round(2)
        return results