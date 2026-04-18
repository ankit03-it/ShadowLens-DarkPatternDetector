# ShadowLens 🔍  
AI-Powered Dark Pattern Detector

## 🚀 Overview
ShadowLens detects manipulative UI patterns (dark patterns) in websites using NLP and rule-based analysis.

## 🧠 Features
- Detects:
  - Fake Urgency
  - Fake Scarcity
  - Confirmshaming
  - Hidden Subscription
  - Forced Continuity
  - Obstruction
- Uses TF-IDF + ML models
- Multi-model comparison (Logistic, Naive Bayes, SVM)

## 📂 Project Structure
data/
- text_pattern.csv
- processed data

models/
- saved vectorizer

src/
- nlp_pipeline.py
- train_models.py

## ⚙️ How to Run

### Step 1: NLP Processing
```bash
python nlp_pipeline.py
