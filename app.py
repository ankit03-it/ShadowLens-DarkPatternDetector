from flask import Flask, request, jsonify
import pickle
import re

# Initialize Flask app
app = Flask(__name__)

# Load trained model
model = pickle.load(open("models/best_model.pkl", "rb"))
vectorizer = pickle.load(open("models/vectorizer.pkl", "rb"))

# Same cleaning function (VERY IMPORTANT)
def clean_text(text):
    text = str(text).lower()

    urgency_words = ["hurry", "limited", "ends", "now", "only", "last", "today"]
    if any(word in text for word in urgency_words):
        text += " urgency_signal"

    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    return text


# API Route
@app.route("/predict", methods=["POST"])
def predict():

    data = request.json  # get JSON from request

    if "text" not in data:
        return jsonify({"error": "No text provided"})

    text = data["text"]

    # Clean text
    clean = clean_text(text)

    # Convert to vector
    vector = vectorizer.transform([clean])

    # Predict
    prediction = model.predict(vector)[0]

    return jsonify({
        "input": text,
        "prediction": prediction
    })


# Run server
if __name__ == "__main__":
    app.run(debug=True)