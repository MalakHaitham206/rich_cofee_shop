# ☕ Rich Coffee Shop — Full Stack Application

A full-stack mini e-commerce system for a coffee shop, built as a complete connected platform including a mobile app, backend API, and admin dashboard.

---

## 🚀 Tech Stack

### 📱 Mobile App

* Expo (React Native)
* TypeScript

### ⚙️ Backend API

* Node.js
* Fastify
* TypeScript

### 🗄️ Database & Auth

* Supabase (PostgreSQL + Auth + Storage)

### 💻 Admin Dashboard

* React (Vite)
* TypeScript
* Tailwind CSS

---

## 📂 Project Structure

```
/mobile       → React Native app  
/backend      → Fastify API  
/dashboard    → Admin panel  
```

---

## ✨ Features

### 👤 Authentication

* User registration & login
* Secure JWT handling
* Password reset via Supabase

---

### 🛍️ Product Catalogue

* Browse products (Desserts, Iced Drinks, Hot Drinks)
* Search & category filtering
* Clean UI with loading & empty states

---

### 🛒 Cart & Checkout

* Add/remove items
* Update quantities
* Place orders via API

---

### 📦 Orders

* View order history
* Order details screen
* Status tracking (Pending, Processing, etc.)

---

### 💻 Admin Dashboard

* Manage products (create, edit, activate/deactivate)
* Upload product images
* View & update orders
* KPI overview (orders, revenue)

---

## 🗄️ Database Setup

### 1. Run SQL Setup

Open Supabase SQL Editor and run:

```
setup.sql
```

This will:

* Create all tables
* Enable Row Level Security (RLS)
* Add policies
* Seed categories & products

---

### 2. Tables

* profiles
* categories
* products
* orders
* order_items

---

### 3. Storage

Create a public bucket:

```
products_images
```

Upload product images and ensure URLs are stored in the database.

---

## 🔐 Security

* Row Level Security (RLS) enabled on all tables
* Role-based access (customer / admin)
* Input validation using Zod
* Environment variables for secrets

---

## ⚙️ Environment Variables

Each sub-project contains a `.env.example`

Example:

```
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
DATABASE_URL=your_db_url
JWT_SECRET=your_secret
```

---

## 👤 Test Accounts

### Customer

```
email: user@test.com
password: 123456
```

### Admin

```
email: admin@test.com
password: 123456
```

---

## ▶️ Running the Project

### 1. Backend

```
cd backend
npm install
npm run dev
```

---

### 2. Mobile App

```
cd mobile
npm install
npx expo start
```

---

### 3. Dashboard

```
cd dashboard
npm install
npm run dev
```

---

## 🎥 Demo Video

A 4–5 minute walkthrough video is included covering:

* User flow (register → browse → order)
* Admin flow (manage orders)
* Code structure explanation

📎 Video Link: *(add your link here)*

---

## 📊 Evaluation Criteria

* Functionality
* Code Quality
* UI / UX Design
* Security
* Bonus Features

---

## 💡 Notes

* Seed data includes 3 categories and 10 products
* All images are hosted on Supabase Storage
* Clean and consistent UI across mobile and dashboard

---

## 👨‍💻 Author

Developed as part of a full-stack challenge.

---
