 
# 📬 Onebox Email Aggregator

**Onebox** is a full-stack email aggregator that brings all your inboxes into a unified dashboard. Built with **Node.js**, **React**, **MongoDB**, and **Elasticsearch**, it supports **real-time email syncing via IMAP**, **WebSocket-powered live updates**, and **Slack/webhook notifications** for important emails. With integrated **AI-powered categorization** and **smart reply suggestions**, Onebox makes managing multiple email accounts efficient and intelligent.

---

## ✨ Features

- 🔄 **Real-time IMAP Sync** – Automatically syncs emails from multiple accounts.
    
- 🧠 **AI-based Categorization** – Classifies emails into categories like Work, Personal, Updates, etc.
    
- 💬 **Smart Reply Suggestions** – Generates relevant, quick responses using Gemini AI.
    
- 🔍 **Lightning-Fast Search** – Uses Elasticsearch for fast and fuzzy searching.
    
- 🖥️ **Modern Frontend** – Responsive UI built with React and Tailwind CSS.
    
- 🔔 **Slack & Webhook Alerts** – Get notifications for high-priority emails.
    

---

## 🚀 Tech Stack

| Layer       | Technology          |
| ----------- | ------------------- |
| Frontend    | React, Tailwind CSS |
| Backend     | Node.js, Express.js |
| Database    | MongoDB (Atlas)     |
| Search      | Elasticsearch       |
| Email Sync  | IMAP                |
| AI Features | Gemini AI API       |
| Deployment  |  Docker (Local)     |

---

## 📁 Project Structure

```
main-dir/
├── backend/
│   ├── .env                 ← Backend environment variables
│   └── docker-compose.yml
├── frontend/
│   └── .env                 ← Frontend environment variables
```

---

## 🛠️ Setup Instructions

Follow these steps to set up and run the project locally.

### ✅ Prerequisites

Make sure the following are installed:

- [Node.js & npm](https://nodejs.org/)
    
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
    
- Git & a terminal (e.g., WSL, Ubuntu Shell)
    
- Access to MongoDB Atlas and Elasticsearch credentials
    

---

### 📝 Step 1: Create `.env` Files

#### 🔹 `backend/.env`

Create a `.env` file in the `backend/` folder with the following keys (values excluded here for security):

```env
IMAP_EMAIL_1=
IMAP_PASS_1=
IMAP_EMAIL_2=
IMAP_PASS_2=

MONGO_URI=
IMAP_HOST=
IMAP_PORT=

ELASTIC_USERNAME=
ELASTIC_PASSWORD=

SLACK_WEBHOOK_URL=
CUSTOM_WEBHOOK_URL=

GEMINI_API_KEY=
```

#### 🔹 `frontend/.env`

Create a `.env` file in the `frontend/` folder:

```env
VITE_BACKEND_URL=
```

---

### ⚙️ Step 2: Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 🚀 Step 3: Run the Application

1. **Start the backend (port `5000`)**:
    
    ```bash
    cd backend
    npm run dev
    ```
    
2. **Start Elasticsearch (port `9200`)** using Docker:
    
    Make sure Docker is running:
    
    ```bash
    docker-compose up
    ```
    
3. **Start the frontend (port `5173`)**:
    
    ```bash
    cd ../frontend
    npm run dev
    ```
    

---

### 🌐 Access the App

- Frontend: [http://localhost:5173](http://localhost:5173/)
    
- Backend API: [http://localhost:5000](http://localhost:5000/)
    

---

### 🛑 Stopping Services

- Press `Ctrl + C` in the terminal(s) running frontend/backend.
    
- To stop Docker containers:
    
   ```bash
    docker-compose down
    ```
    




