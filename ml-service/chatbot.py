"""
ShopAI Chatbot
Rule-based + Optional OpenAI integration
"""

import os

# Optional: use OpenAI API for smarter responses
# pip install openai
# Set OPENAI_API_KEY in environment

OPENAI_AVAILABLE = False
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    OPENAI_AVAILABLE = True
except:
    pass

# Rule-based responses (works without OpenAI)
RULES = {
    "order": "Your order is being processed! Go to My Orders to track it. 📦",
    "track": "You can track your order in My Orders section. Expected delivery: 3-5 business days.",
    "return": "We offer hassle-free 30-day returns on all products! Visit My Orders to initiate a return. ↩️",
    "refund": "Refunds are processed within 5-7 business days after we receive the returned item.",
    "payment": "We accept UPI, Credit/Debit cards, Net Banking, and Cash on Delivery. 💳",
    "delivery": "Standard delivery: 3-5 days. Express delivery: 1-2 days (extra charge).",
    "cancel": "You can cancel your order within 24 hours of placing it from My Orders section.",
    "discount": "Check our Deals section for latest offers! Use code SHOPAI10 for 10% off. 🎉",
    "hello": "Hi there! 👋 I'm ShopAI assistant. How can I help you today?",
    "hi": "Hello! 😊 Welcome to ShopAI. What can I help you with?",
    "price": "You can find the best price on the product page. We also show price history! 📊",
    "shipping": "Free shipping on orders above ₹499! Express shipping available at extra cost.",
    "warranty": "Most electronics come with 1-year manufacturer warranty. Check product details for info.",
    "help": "I can help with: orders, returns, payments, delivery, discounts. What do you need? 😊"
}

SYSTEM_PROMPT = """You are ShopAI, a helpful e-commerce customer support assistant.
You help customers with orders, returns, payments, product queries, and delivery.
Be friendly, concise, and helpful. Always respond in 1-3 sentences.
If you don't know something, suggest they contact support@shopai.com."""

def get_chat_reply(message: str) -> str:
    """Get chatbot reply — uses OpenAI if available, otherwise rule-based"""

    if OPENAI_AVAILABLE and os.getenv("OPENAI_API_KEY"):
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message}
                ],
                max_tokens=150
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI error: {e}")
            # Fall through to rule-based

    # Rule-based fallback
    msg_lower = message.lower()
    for keyword, reply in RULES.items():
        if keyword in msg_lower:
            return reply

    return "I'm not sure about that. Please contact us at support@shopai.com or call 1800-SHOPAI. 😊"
