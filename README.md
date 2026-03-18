# 🛒 ShopAI — AI-Powered E-Commerce Platform
--
##img <img width="1917" height="924" alt="image" src="https://github.com/user-attachments/assets/4bbb5cb3-12ae-4335-be92-a085d7f3c2c2" />


> Full-stack e-commerce application with AI-based recommendations, smart search, and chatbot support.

![Tech Stack](https://img.shields.io/badge/Frontend-React-blue) ![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![Database](https://img.shields.io/badge/Database-MySQL-orange) ![AI](https://img.shields.io/badge/AI-Python%20ML-purple)

---

## 📌 Features

- ✅ User Login / Signup (JWT Authentication)
- ✅ Product Listing, Cart, Checkout
- 🔍 AI Smart Search (NLP-based)
- 🧠 Personalized Product Recommendations (Collaborative Filtering)
- 💬 AI Chatbot for Customer Support
- 🔗 "People Also Bought" Feature (Association Rule Mining)

---

## 🏗️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React + CSS         |
| Backend    | Java Spring Boot    |
| Database   | MySQL               |
| AI Service | Python Flask + ML   |

---

## 📂 Project Structure

```
shopai/
├── frontend/          # React Application
├── backend/           # Spring Boot REST API
├── ml-service/        # Python Flask AI Service
├── database/          # MySQL Schema & Seed Data
└── README.md
```

---

## 🚀 How to Run

### 1. Database Setup
```bash
cd database
mysql -u root -p < schema.sql
mysql -u root -p shopai < seed.sql
```

### 2. Backend (Spring Boot)
```bash
cd backend
# Edit src/main/resources/application.properties (set your DB password)
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 3. ML Service (Python)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### 4. Frontend (React)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | /api/auth/register              | Register new user            |
| POST   | /api/auth/login                 | Login, get JWT token         |
| GET    | /api/products                   | Get all products             |
| GET    | /api/products/search?q={}       | Search products              |
| GET    | /api/recommendations/{userId}   | Get AI recommendations       |
| POST   | /api/cart/add                   | Add item to cart             |
| GET    | /api/cart/{userId}              | Get user cart                |
| POST   | /api/orders/checkout            | Place order                  |
| POST   | /api/chatbot/message            | Send message to AI chatbot   |
| GET    | /api/products/{id}/also-bought  | People also bought           |

---


## 👨‍💻 Made By

**Alok Shaw** — B.Tech Final Year  
GitHub: [your-github-username]

---

## 📄 License

MIT License
