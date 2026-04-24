# train_pipeline.py

import pandas as pd
import numpy as np
import re
import os
import pickle

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split

# Models
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC

from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

import seaborn as sns
import matplotlib.pyplot as plt


# ================================
# 1. LOAD DATA
# ================================

print("🔹 Loading dataset...")

df = pd.read_csv("text_pattern.csv")

# Normalize column names
df.columns = df.columns.str.strip().str.lower()

# Validate required columns
if 'text' not in df.columns or 'label' not in df.columns:
    raise Exception("❌ Dataset must contain 'text' and 'label' columns")

# ================================
# 2. CLEAN DATA
# ================================

print("🔹 Cleaning data...")

df = df.dropna()
df = df.drop_duplicates()
df = df.reset_index(drop=True)


# ================================
# 3. TEXT PREPROCESSING
# ================================

def clean_text(text):
    text = str(text).lower()

    # 🔥 keyword boost (controlled)
    urgency_words = ["hurry", "limited", "ends", "now", "only", "last", "today"]
    if any(word in text for word in urgency_words):
        text += " urgency_signal"

    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)

    # Normalize spaces
    text = re.sub(r'\s+', ' ', text).strip()

    return text


print("🔹 Applying text preprocessing...")
df['clean_text'] = df['text'].apply(clean_text)


# ================================
# 4. VECTORIZATION
# ================================

print("🔹 Vectorizing text...")

vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),
    max_features=1500,
    min_df=2
)

X = vectorizer.fit_transform(df['clean_text'])
y = df['label']


# ================================
# 5. TRAIN-TEST SPLIT
# ================================

print("🔹 Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ================================
# 6. MODEL TRAINING
# ================================

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight='balanced'),
    "Naive Bayes": MultinomialNB(),
    "Linear SVM": LinearSVC(class_weight='balanced', dual=False)
}

results = {}
trained_models = {}

print("\n🚀 Training Models...\n")

for name, model in models.items():
    print(f"🔹 {name}")

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    results[name] = acc
    trained_models[name] = model

    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, zero_division=0))
    print("-" * 50)


# ================================
# 7. BEST MODEL SELECTION
# ================================

best_model_name = max(results, key=results.get)
best_model = trained_models[best_model_name]

print("\n🏆 BEST MODEL:", best_model_name)
print("Accuracy:", results[best_model_name])


# ================================
# 8. CONFUSION MATRIX
# ================================

print("🔹 Generating confusion matrix...")

y_pred_best = best_model.predict(X_test)

cm = confusion_matrix(y_test, y_pred_best)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title(f"Confusion Matrix - {best_model_name}")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()


# ================================
# 9. SAVE MODEL + VECTORIZER
# ================================

print("🔹 Saving model and vectorizer...")

os.makedirs("models", exist_ok=True)

with open("models/best_model.pkl", "wb") as f:
    pickle.dump(best_model, f)

with open("models/vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ Saved successfully")


# ================================
# 10. FINAL SUMMARY
# ================================

print("\n📊 FINAL RESULTS:")
for k, v in results.items():
    print(f"{k}: {v:.4f}")

print("\n🔥 Pipeline Completed Successfully")