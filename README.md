# 🏥 Medical Inventory System

A full-stack medical inventory management system built with React, TypeScript, Node.js, Express, and MongoDB. It helps hospitals, pharmacies, and medical centers track stock, manage items, suppliers, and categories, receive smart alerts, and generate reports with AI predictions.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Demo Accounts](#-demo-accounts)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🔍 Overview

Medical Inventory System is a complete inventory management solution for the healthcare sector. It solves real problems such as medication stockouts, expired drugs, and lack of real-time tracking — by providing a centralized, secure, and easy-to-use platform.

**Key goals:**
- ✅ Track every item from Stock IN to Stock OUT
- ✅ Get automatic alerts before stock runs out
- ✅ Generate AI-powered predictions for future usage
- ✅ Export reports (PDF) with one click
- ✅ Manage everything from one dashboard

---

## ✨ Features

### 🔐 Authentication & Authorization
- Login / Register / Logout
- JWT-based authentication
- Role-based access control (Admin, Manager, Staff, Viewer)
- Forgot password / Reset password

### 📦 Items Management
- Full CRUD (Create, Read, Update, Delete)
- Search, filters, and pagination
- Stock status badges (In Stock, Low Stock, Out of Stock, Expiring Soon)
- Assign category and supplier

### 🏷️ Categories
- CRUD operations
- Auto item count per category
- Prevent deleting categories with items

### 🏢 Suppliers
- CRUD operations
- Contact information management
- Supplier-item relationships

### 📊 Stock Management
- Stock IN and Stock OUT
- Automatic inventory quantity updates
- Stock history table with filters
- Auto-generate alerts on low stock

### 🔔 Alerts & Notifications
- Low stock alerts
- Out-of-stock alerts
- Expiring soon alerts
- Dismiss / Resolve alerts
- Dashboard alerts widget

### 📈 Reports & Analytics
- Inventory report
- Stock movement report
- Charts: Bar, Line, Pie
- AI usage predictions with confidence score
- Export to PDF

### 🎨 Dashboard
- KPI cards (Total Items, Low Stock, Out of Stock, Suppliers)
- Recent transactions
- Quick access links
- Dark mode

### ⚙️ Settings
- Profile update
- Profile image upload
- Preferences

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Redux Toolkit | State management |
| React Router v6 | Routing |
| Axios | HTTP client |
| Recharts | Charts |
| jsPDF | PDF export |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Nodemailer | Email sending |

---

## 📂 Project Structure
