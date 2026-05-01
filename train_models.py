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

df = pd.read_csv("final_data.csv")   # ✅ USE FINAL DATA
df.columns = df.columns.str.strip().str.lower()

if 'text' not in df.columns or 'pattern category' not in df.columns:
    raise Exception("❌ Dataset must contain 'text' and 'pattern category'")


# ================================
# 2. CLEAN DATA
# ================================

print("🔹 Cleaning data...")

df = df.dropna()
df = df.drop_duplicates()
df = df.reset_index(drop=True)


# ================================
# 3. FIX CLASS NAMES (CRITICAL)
# ================================

print("🔹 Normalizing class labels...")

df['pattern category'] = df['pattern category'].replace({
    'scarcity': 'fake_scarcity',
    'urgency': 'fake_urgency'
})

print("\n📊 FINAL CLASS DISTRIBUTION:")
print(df['pattern category'].value_counts())


# ================================
# 4. TEXT PREPROCESSING
# ================================

def clean_text(text):
    text = str(text).lower()

    urgency_words = ["hurry", "limited", "ends", "now", "only", "last", "today"]
    if any(word in text for word in urgency_words):
        text += " urgency_signal"

    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    return text


print("🔹 Preprocessing text...")
df['clean_text'] = df['text'].apply(clean_text)


# ================================
# 5. VECTORIZE
# ================================

print("🔹 Vectorizing...")

vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),
    max_features=2000,
    min_df=2
)

X = vectorizer.fit_transform(df['clean_text'])
y = df['pattern category']   # ✅ MULTI-CLASS


# ================================
# 6. TRAIN TEST SPLIT
# ================================

print("🔹 Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ================================
# 7. TRAIN MODELS
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
# 8. BEST MODEL
# ================================

best_model_name = max(results, key=results.get)
best_model = trained_models[best_model_name]

print("\n🏆 BEST MODEL:", best_model_name)
print("Accuracy:", results[best_model_name])


# ================================
# 9. CONFUSION MATRIX
# ================================

print("🔹 Generating confusion matrix...")

y_pred_best = best_model.predict(X_test)

cm = confusion_matrix(y_test, y_pred_best, labels=best_model.classes_)

plt.figure(figsize=(12,8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=best_model.classes_,
            yticklabels=best_model.classes_)
plt.title(f"Confusion Matrix - {best_model_name}")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.xticks(rotation=45)
plt.yticks(rotation=45)
plt.show()


# ================================
# 10. SAVE MODEL
# ================================

print("🔹 Saving model and vectorizer...")

os.makedirs("models", exist_ok=True)

with open("models/best_model.pkl", "wb") as f:
    pickle.dump(best_model, f)

with open("models/vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("models/classes.pkl", "wb") as f:
    pickle.dump(best_model.classes_, f)

print("✅ Saved successfully")


# ================================
# 11. FINAL SUMMARY
# ================================

print("\n📊 FINAL RESULTS:")
for k, v in results.items():
    print(f"{k}: {v:.4f}")

print("\n🔥 Pipeline Completed Successfully")