# nlp_pipeline.py

import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import numpy as np
import os

# Load dataset
df = pd.read_csv("text_pattern.csv")

# Clean column names
df.columns = df.columns.str.strip().str.lower()

# Clean dataset
df = df.dropna()
df = df.drop_duplicates()
df = df.reset_index(drop=True)

# -------------------------------
# Text cleaning + keyword boosting
# -------------------------------
def clean_text(text):
    text = str(text).lower()

    # 🔥 Boost urgency/scarcity keywords
    urgency_words = ["hurry", "limited", "ends", "now", "only", "last", "today"]
    if any(word in text for word in urgency_words):
        text += " urgency_signal"

    # Clean text
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    return text

# Apply cleaning
df['clean_text'] = df['text'].apply(clean_text)

# -------------------------------
# TF-IDF Vectorization (IMPROVED)
# -------------------------------
vectorizer = TfidfVectorizer(
    ngram_range=(1,3),     # 🔥 includes phrases
    max_features=1500,
    min_df=2
)

X = vectorizer.fit_transform(df['clean_text'])
y = df['label']

# -------------------------------
# Save outputs
# -------------------------------
os.makedirs("data", exist_ok=True)
os.makedirs("models", exist_ok=True)

np.save("data/X.npy", X.toarray())
np.save("data/y.npy", y.to_numpy())

with open("models/vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ NLP pipeline complete")
print("Dataset shape:", X.shape)