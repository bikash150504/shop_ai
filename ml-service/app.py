from flask import Flask, request, jsonify
from flask_cors import CORS
from recommend import get_recommendations, get_also_bought
from chatbot import get_chat_reply

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"status": "ShopAI ML Service Running"})

# AI Recommendations for a user
@app.route('/recommend/<int:user_id>', methods=['GET'])
def recommend(user_id):
    try:
        products = get_recommendations(user_id)
        return jsonify({"userId": user_id, "recommendations": products})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# People also bought
@app.route('/also-bought/<int:product_id>', methods=['GET'])
def also_bought(product_id):
    try:
        products = get_also_bought(product_id)
        return jsonify({"productId": product_id, "alsoBought": products})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Chatbot
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get("message", "")
        reply = get_chat_reply(message)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
