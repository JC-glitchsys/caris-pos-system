POS System


1. Project Setup

Prerequisites: Node.js, npm, MySQL, XAMPP, Git
Backend: cd caris_backend → npm install → set up .env from .env.example
Frontend: cd caris_frontend → npm install
Run: npm run dev for both (backend on :5000, frontend via Vite)

2. Backend/Database Used

Backend: Node.js, Express.js, JWT, bcryptjs
Database: MySQL — tables: users, products, sales, sale_items
(Frontend stack also documented: React, TypeScript, Vite, Tailwind, shadcn/ui, TanStack Query, Zustand)

3. Seed Instructions 

Run node seed.js from caris_backend
Creates: 1 cashier account (cashier@example.com / cashier123), 15 sample products, 3 categories (Food, Drinks, Snacks)

4. Basic API Documentation 

Base URL: http://localhost:5000/api
POST /auth/login
GET /products (+ ?search=, ?category=, combined)
POST /sales, GET /sales, GET /sales/:id
Bearer token required for protected routes
