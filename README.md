# Mini Point-of-Sale (POS) System

A full-stack Mini Point-of-Sale (POS) System developed as a technical assessment for a Web Developer - ReactJS Internship position.

The system allows cashiers to log in, browse products, search and filter products, manage a shopping cart, process sales, and view sales history.

## Features

- Cashier authentication
- Product listing
- Product search
- Product category filtering
- Shopping cart
- Increase/decrease item quantity
- Remove items from cart
- Stock validation
- Checkout and payment processing
- Automatic change calculation
- Stock deduction after successful sale
- Sales history
- Sale details
- Protected POS and sales pages

## Tech Stack

### Frontend

- ReactJS
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- TanStack Query
- Zustand

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs

### Database

- MySQL

### Version Control

- Git
- GitHub

## Project Structure

```text
pos_system/
├── caris_backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── seed.js
│   ├── .env.example
│   └── package.json
│
└── caris_frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   ├── lib/
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
Prerequisites
Node.js
npm
MySQL
XAMPP
Git
Project Setup
Backend

Navigate to the backend folder:

cd caris_backend

Install dependencies:

npm install

Create a .env file based on .env.example.

Example:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=caris_pos_db
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secret_key
Frontend

Open another terminal and navigate to the frontend folder:

cd caris_frontend

Install dependencies:

npm install
Database Setup

The project uses MySQL.

Start MySQL using XAMPP, then create the database:

CREATE DATABASE caris_pos_db;

The database contains the following main tables:

users
products
sales
sale_items

Create the tables using the SQL schema included in the project.

Seed Data

From the caris_backend folder, run:

node seed.js

The seed script creates:

1 cashier account
15 sample products
3 product categories
Cashier Account
Email: cashier@example.com
Password: cashier123
Product Categories
Food
Drinks
Snacks
Running the Application
Backend

From the caris_backend folder:

npm run dev

The backend runs on:

http://localhost:5000
Frontend

From the caris_frontend folder:

npm run dev

Open the local URL provided by Vite.

Basic API Documentation

Base URL:

http://localhost:5000/api
Authentication
Login
POST /auth/login

Request body:

{
  "email": "cashier@example.com",
  "password": "cashier123"
}
Products
Get Products
GET /products

Returns the available products.

Search Products
GET /products?search=burger

Searches products by name.

Filter by Category
GET /products?category=Food

Filters products by category.

Search and Filter
GET /products?search=burger&category=Food

Combines product name search and category filtering.

Sales
Create Sale
POST /sales

Request body:

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "amount_paid": 250
}

The backend validates stock, calculates the final sale total, saves the sale and sale items, deducts the sold quantity from stock, and calculates the change.

Get Sales History
GET /sales

Returns completed sales.

Get Sale Details
GET /sales/:id

Returns the selected sale and its items.

Authentication Header

Protected endpoints require a Bearer token:

Authorization: Bearer <token>
State Management
TanStack Query - used for server-side data such as products and sales
Zustand - used for shopping cart state
Authentication and Security
Passwords are hashed using bcryptjs.
JWT is used for authentication.
POS and sales routes are protected.
Database credentials and secrets are stored in environment variables.
The .env file is excluded from Git.
.env.example is included in the repository.
Stock and payment are validated on the backend during checkout.
Product prices are retrieved from the database during checkout.
UI Components

The project uses shadcn/ui with Tailwind CSS.

Main shadcn/ui components used:

Card
Button
Input
Badge
Table
Dialog

The POS interface separates the product list and shopping cart for easier use.

Application Flow
Login
  ↓
View Products
  ↓
Search / Filter Products
  ↓
Add Products to Cart
  ↓
Update Quantity
  ↓
Checkout
  ↓
Enter Amount Paid
  ↓
Calculate and Display Change
  ↓
Save Sale and Update Stock
  ↓
View Sales History
  ↓
View Sale Details
  ↓
Logout
Environment Variables

The actual .env file is not included in the repository.

Use .env.example as a template:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=caris_pos_db
DB_PORT=3306
PORT=5000
JWT_SECRET=
