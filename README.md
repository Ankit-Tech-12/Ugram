# 🚀 Ugram — Modern Social Media Platform

<p align="center">
  <b>A full-stack social media web app with real-time interactions, clean UI, and production-ready architecture.</b>
</p>

---

## 🌟 Overview

**Ugram** is a modern social media application where users can:

* Create and share posts 📸
* Like / Unlike posts ❤️
* View personalized feeds 📰
* Manage their profile 👤

Built with a **scalable full-stack architecture**, focusing on performance, clean UI, and real-world production patterns.

---

## 🔥 Live Demo

👉 *Coming soon (Deploy on Vercel + Render)*

---

## ✨ Key Features

### 🔐 Authentication System

* Secure login & registration
* JWT-based authentication
* Protected routes (frontend + backend)
* Persistent sessions with cookies

### 📸 Post System

* Upload images with captions
* Cloud storage using Cloudinary
* Optimized media handling

### ❤️ Engagement System

* Like / Unlike posts
* Optimistic UI updates (instant feedback)
* Global state sync using Redux Toolkit

### 📰 Feed System

* Dynamic feed (excluding own posts)
* Aggregated user + like data
* MongoDB aggregation pipelines

### 👤 Profile System

* User profile with post grid
* Real-time post count
* Clean UI layout

---

## 🧠 Tech Stack

### 🎨 Frontend

* React (Vite)
* Tailwind CSS (Dark UI)
* Redux Toolkit (state management)
* Framer Motion (animations)

### ⚙️ Backend

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (file upload)

### ☁️ Services

* Cloudinary (image hosting)

---

## 🏗️ Architecture Highlights

* 🔄 **Redux Toolkit + Async Thunks** for scalable state management
* ⚡ **Optimistic UI updates** for likes (instant UX)
* 🧠 **Aggregation pipelines** for efficient feed generation
* 🔐 **Cookie-based authentication** for secure sessions
* 📦 Clean separation of frontend & backend

---

## 📂 Project Structure

```id="m3k2js"
Ugram/
├── client/        # React frontend
│   ├── components/
│   ├── pages/
│   ├── features/  # Redux slices
│   └── utils/
│
├── server/        # Node backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── utils/
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```id="l7w3d1"
git clone https://github.com/Ankit-Tech-12/Ugram.git
cd Ugram
```

---

### 2️⃣ Backend Setup

```id="z9x4v2"
cd server
npm install
```

Create `.env`:

```id="x8a2p1"
PORT=8000
MONGODB_URI=your_mongodb_uri

ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
```

Run:

```id="b2n8q7"
npm run dev
```

---

### 3️⃣ Frontend Setup

```id="q5r8t9"
cd client
npm install
npm run dev
```

---

## 🌐 Environment

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |

---

## 🚀 Deployment

### Frontend

Deploy on Vercel

### Backend

Deploy on Render or Railway

---

## 📈 Future Enhancements

* 💬 Comments system
* 👥 Follow / Unfollow users
* 🔔 Notifications
* 📱 Mobile-first responsive UI
* 🔍 User search
* ✏️ Edit profile
* 📊 Analytics dashboard

---

## 🧪 Testing Ideas

* Auth flow (login/logout/session restore)
* Image upload edge cases
* Like system sync
* Feed performance under load

---

## 🤝 Contributing

Contributions are welcome!
Fork the repo and create a pull request 🚀

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Anii**

> Built with ❤️, late nights, and a lot of debugging 😏

---
