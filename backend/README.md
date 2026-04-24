# ☕ Rich Coffee Shop — Backend API

A RESTful API built with **Node.js + Fastify + TypeScript**, backed by **Supabase** (PostgreSQL + Auth). It handles authentication, product catalogue, customer orders, and admin management for the Rich Coffee Shop mini e-commerce system.

---

## 🏗️ Tech Stack

| Layer        | Technology                           |
|--------------|--------------------------------------|
| Runtime      | Node.js 20+                         |
| Framework    | Fastify 5                           |
| Language     | TypeScript 5                        |
| Database/Auth| Supabase (PostgreSQL + Auth)        |
| Validation   | Zod                                 |
| JWT          | @fastify/jwt                        |
| CORS         | @fastify/cors                       |
| Dev server   | tsx watch                           |

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase client (service role)
│   ├── middleware/
│   │   └── auth.ts              # JWT authenticate + requireAdmin guards
│   ├── routes/
│   │   ├── auth.ts              # POST /auth/register, /login, /forget-password, GET /auth/me
│   │   ├── categories.ts        # GET /categories
│   │   ├── products.ts          # GET /products, /products/:id
│   │   ├── orders.ts            # POST /orders, GET /orders, /orders/:id  (auth required)
│   │   └── admin.ts             # /admin/* (admin role required)
│   └── server.ts                # Fastify app entry point
├── .env                         # Local env (not committed)
├── .env.example                 # Template — copy → .env and fill in
├── package.json
└── tsconfig.json
```

---

## ⚙️ Prerequisites

- **Node.js** ≥ 20 ([nodejs.org](https://nodejs.org))
- **npm** ≥ 10
- A **Supabase** project with the schema from `../setup.sql` applied

---

## 🚀 Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

| Variable                   | Where to find it                                     |
|----------------------------|------------------------------------------------------|
| `SUPABASE_URL`             | Supabase → Project Settings → API → Project URL      |
| `SUPABASE_SERVICE_ROLE_KEY`| Supabase → Project Settings → API → service_role key |
| `JWT_SECRET`               | Any strong random string (≥ 32 chars)                |
| `PORT`                     | Default `3000` — change if needed                    |

> ⚠️ **Never commit `.env`** — it contains your service role key which bypasses all Row Level Security.

### 3. Apply the database schema

In the **Supabase SQL Editor**, run the file at the repo root:

```
../setup.sql
```

This creates all tables, enables RLS, adds policies, and seeds 3 categories + 10 products.

### 4. Run in development

```bash
npm run dev
```

Server starts at **http://localhost:3000**

### 5. Build for production

```bash
npm run build   # compiles TypeScript → dist/
npm start       # runs dist/server.js
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:3000`

### 🔐 Auth — `/auth`

| Method | Endpoint                | Auth | Description                              |
|--------|-------------------------|------|------------------------------------------|
| POST   | `/auth/register`        | ❌   | Register a new customer account          |
| POST   | `/auth/login`           | ❌   | Login and receive a JWT token            |
| POST   | `/auth/forget-password` | ❌   | Send a password-reset email via Supabase |
| GET    | `/auth/me`              | ✅   | Get the currently authenticated user     |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login response:**
```json
{
  "message": "Logged in successfully",
  "token": "<jwt>",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "customer" }
}
```

---

### 📦 Categories — `/categories`

| Method | Endpoint       | Auth | Description             |
|--------|----------------|------|-------------------------|
| GET    | `/categories`  | ❌   | List all categories     |

---

### 🛍️ Products — `/products`

| Method | Endpoint         | Auth | Description                                       |
|--------|------------------|------|---------------------------------------------------|
| GET    | `/products`      | ❌   | List active products (filter by `category_id`, `search`) |
| GET    | `/products/:id`  | ❌   | Get a single active product by UUID               |

**Query params for `GET /products`:**
- `category_id` (UUID, optional) — filter by category
- `search` (string, optional) — search by name or description

---

### 🛒 Orders — `/orders` *(requires JWT)*

| Method | Endpoint       | Auth     | Description                        |
|--------|----------------|----------|------------------------------------|
| POST   | `/orders`      | Customer | Place a new order                  |
| GET    | `/orders`      | Customer | List the current user's orders     |
| GET    | `/orders/:id`  | Customer | Get full details of a single order |

**Place order body:**
```json
{
  "items": [
    { "product_id": "<uuid>", "quantity": 2 },
    { "product_id": "<uuid>", "quantity": 1 }
  ]
}
```

**Place order response:**
```json
{
  "message": "Order placed successfully",
  "order_id": "<uuid>"
}
```

---

### 🔧 Admin — `/admin` *(requires JWT + admin role)*

#### Orders

| Method | Endpoint              | Description                                  |
|--------|-----------------------|----------------------------------------------|
| GET    | `/admin/orders`       | List all orders with customer profiles       |
| PATCH  | `/admin/orders/:id`   | Update order status                          |

**Update order status body:**
```json
{ "status": "processing" }
```
Valid values: `pending` | `processing` | `completed` | `cancelled`

#### Products

| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | `/admin/products`               | List ALL products (incl. inactive)   |
| POST   | `/admin/products`               | Create a new product                 |
| PATCH  | `/admin/products/:id`           | Update product fields                |
| PATCH  | `/admin/products/:id/toggle`    | Toggle `is_active` on/off            |
| DELETE | `/admin/products/:id`           | Permanently delete a product         |

**Create product body:**
```json
{
  "name": "Latte",
  "description": "Creamy espresso",
  "price": 45,
  "image_url": "https://...",
  "category_id": "<uuid>"
}
```

---

## 🔐 Authentication Flow

1. Client registers or logs in → receives a **JWT** signed by this server.
2. Include the token in subsequent requests as a **Bearer token**:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. The server verifies the token and attaches `{ id, email, role }` to `request.user`.
4. **Admin routes** additionally check `request.user.role === 'admin'`.

---

## 🧪 Test Accounts

| Role     | Email           | Password |
|----------|-----------------|----------|
| Customer | user@test.com   | 123456   |
| Admin    | admin@test.com  | 123456   |

---

## 🛡️ Security

- **Supabase Service Role key** is used server-side only — it bypasses RLS so the backend can read/write anything.
- **Row Level Security (RLS)** is still enabled on all tables to protect direct client access.
- **Zod validation** on all request bodies and query params.
- **JWT expiry** set to 7 days.
- **Role guard** (`requireAdmin`) protects all `/admin/*` routes.

---

## 📝 Available Scripts

| Command         | Description                                 |
|-----------------|---------------------------------------------|
| `npm run dev`   | Start dev server with hot reload (tsx watch)|
| `npm run build` | Compile TypeScript to `dist/`              |
| `npm start`     | Run compiled production build              |

---

## 🐛 Troubleshooting

| Problem                          | Solution                                                          |
|----------------------------------|-------------------------------------------------------------------|
| `JWT_SECRET is undefined`        | Make sure `.env` exists and is populated                         |
| `supabase.auth.admin` errors     | Ensure you use the **service_role** key, not the anon key        |
| 401 on protected routes          | Pass `Authorization: Bearer <token>` header                      |
| 403 on `/admin/*`                | User's `role` in `profiles` table must be `'admin'`              |
| CORS errors from frontend        | `@fastify/cors` is registered globally; adjust origin if needed  |
