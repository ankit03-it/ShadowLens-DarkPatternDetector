from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import numpy as np
import requests
from bs4 import BeautifulSoup
import time
import json

# Selenium
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

# -------------------------------
# INIT
# -------------------------------
app = Flask(__name__)
CORS(app)

model = pickle.load(open("models/best_model.pkl", "rb"))
vectorizer = pickle.load(open("models/vectorizer.pkl", "rb"))
classes = pickle.load(open("models/classes.pkl", "rb"))

# 🔥 CACHE
llm_cache = {}

# -------------------------------
# CLEAN TEXT
# -------------------------------
def clean_text(text):
    text = str(text).lower()

    urgency_words = ["hurry", "limited", "ends", "now", "only", "last", "today"]
    if any(word in text for word in urgency_words):
        text += " urgency_signal"

    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    return text


# -------------------------------
# FILTER BAD TEXT
# -------------------------------
def is_valid_text(t):
    if len(t) < 10:
        return False
    if t.isupper():
        return False
    return True


# -------------------------------
# FALLBACK (SAFE)
# -------------------------------
def fallback_explanation(text):
    t = text.lower()

    if any(word in t for word in ["only", "limited", "left"]):
        return {
            "type": "fake_scarcity",
            "explanation": "Creates pressure by suggesting limited availability."
        }

    if any(word in t for word in ["hurry", "now", "today", "ends"]):
        return {
            "type": "fake_urgency",
            "explanation": "Pushes user to act quickly."
        }

    if "subscribe" in t or "trial" in t:
        return {
            "type": "forced_continuity",
            "explanation": "May lead to automatic charges after trial."
        }

    return {
        "type": "none",
        "explanation": "No clear manipulation detected."
    }


# -------------------------------
# OLLAMA LLM (EXPLAIN ONLY)
# -------------------------------
def explain_dark_pattern(text):

    if text in llm_cache:
        return llm_cache[text]

    try:
        prompt = f"""
You are a strict UX auditor.

IMPORTANT RULES:
- Discounts (e.g. 10% OFF) are NOT dark patterns
- Generic offers are NOT dark patterns
- Only classify if manipulation is CLEAR

Text:
"{text}"

Return ONLY JSON:
{{
  "type": "fake_urgency | fake_scarcity | confirmshaming | obstruction | forced_continuity | hidden_subscription | social_proof | misdirection | none",
  "explanation": "short explanation"
}}
"""

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3:8b",
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        data = response.json()

        if "response" not in data or not data["response"].strip():
            return fallback_explanation(text)

        result = data["response"].strip()

        # Clean markdown
        if "```" in result:
            result = result.replace("```json", "").replace("```", "").strip()

        try:
            parsed = json.loads(result)
        except:
            print("Bad JSON from Ollama:", result)
            parsed = fallback_explanation(text)

        llm_cache[text] = parsed
        time.sleep(0.3)

        return parsed

    except Exception as e:
        print("Ollama error:", e)
        return fallback_explanation(text)


# -------------------------------
# REQUEST SCRAPER
# -------------------------------
def extract_text_requests(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.text, "html.parser")

        texts = []
        for element in soup.stripped_strings:
            t = element.strip()
            if len(t) > 5:
                texts.append(t)

        return list(set(texts))

    except Exception as e:
        print("Error:", e)
        return []


# -------------------------------
# SELENIUM SCRAPER
# -------------------------------
def extract_text_selenium(url):
    try:
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")

        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )

        driver.get(url)
        time.sleep(5)

        html = driver.page_source
        driver.quit()

        soup = BeautifulSoup(html, "html.parser")

        texts = []
        for element in soup.stripped_strings:
            t = element.strip()
            if len(t) > 5:
                texts.append(t)

        return list(set(texts))

    except Exception as e:
        print("Error:", e)
        return []


# -------------------------------
# SINGLE TEXT API
# -------------------------------
@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"})

    text = data["text"]

    # -------------------------------
    # 🔥 RULE BOOST (FIRST)
    # -------------------------------
    def rule_boost(text):
        t = text.lower()

        if "auto-renew" in t or "unless cancelled" in t:
            return "forced_continuity"

        if "no, i don't" in t or "i dont" in t or "i don't want" in t:
            return "confirmshaming"

        return None

    rule = rule_boost(text)

    # -------------------------------
    # CLEAN + VECTOR
    # -------------------------------
    clean = clean_text(text)
    vector = vectorizer.transform([clean])

    # -------------------------------
    # 🔥 IF RULE EXISTS → OVERRIDE ML
    # -------------------------------
    if rule:
        prediction = rule
        confidence = 0.95
    else:
        prediction = model.predict(vector)[0]

        if hasattr(model, "decision_function"):
            scores = model.decision_function(vector)
            confidence = float(np.max(scores))
        else:
            probs = model.predict_proba(vector)
            confidence = float(np.max(probs))

    # -------------------------------
    # RESULT
    # -------------------------------
    result = {
        "input": text,
        "prediction": prediction,
        "confidence": confidence
    }

    if prediction != "none":
        result["analysis"] = explain_dark_pattern(text)

    return jsonify(result)


# -------------------------------
# URL ANALYSIS API
# -------------------------------
@app.route("/analyze-url", methods=["POST"])
def analyze_url():

    data = request.json

    if not data or "url" not in data:
        return jsonify({"error": "No URL provided"})

    url = data["url"]
    mode = data.get("mode", "requests")

    if mode == "selenium":
        texts = extract_text_selenium(url)
    else:
        texts = extract_text_requests(url)

    if not texts:
        return jsonify({"error": "No content found"})

    results = []
    llm_calls = 0

    for t in texts:

        if not is_valid_text(t):
            continue

        clean = clean_text(t)
        vector = vectorizer.transform([clean])

        prediction = model.predict(vector)[0]

        if hasattr(model, "decision_function"):
            scores = model.decision_function(vector)
            confidence = float(np.max(scores))
        else:
            probs = model.predict_proba(vector)
            confidence = float(np.max(probs))

        # skip weak confidence
        if confidence < 0.8:
            continue

        # skip neutral
        if prediction == "none":
            continue

        if llm_calls >= 10:
            break

        explanation = explain_dark_pattern(t)
        llm_calls += 1

        results.append({
            "text": t,
            "type": prediction,
            "confidence": confidence,
            "analysis": explanation
        })

    return jsonify({
        "url": url,
        "mode": mode,
        "total_texts": len(texts),
        "detections": results,
        "llm_calls_used": llm_calls
    })


# -------------------------------
# RUN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)