# nlp_pipeline.py

import pandas as pd #type: ignore
import re #type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer #type: ignore
import pickle #type: ignore
import numpy as np #type: ignore

# Load dataset
df = pd.read_csv("text_pattern.csv")

# Clean dataset
df = df.dropna()
df = df.drop_duplicates()
df = df.reset_index(drop=True)

# Text cleaning function
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Apply cleaning
df['clean_text'] = df['TEXT'].apply(clean_text)

# TF-IDF Vectorization
vectorizer = TfidfVectorizer(ngram_range=(1,2))

X = vectorizer.fit_transform(df['clean_text'])
y = df['LABEL']

# Save vectorized data

np.save("X.npy", X.toarray())   # features
np.save("y.npy", y.to_numpy())  # labels

# Save vectorizer
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("✅ NLP pipeline complete")
print("Shape:", X.shape)