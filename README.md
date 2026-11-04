# 🏥 Medical Inventory Management System

A full-stack medical inventory management system designed for hospitals, pharmacies, and healthcare centers. It helps healthcare organizations manage medical supplies, monitor stock levels, organize suppliers and categories, receive automated alerts, and analyze inventory data through reports and AI-powered predictions.

**Built with React, TypeScript, Node.js, Express.js, and MongoDB.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Demo Accounts](#-demo-accounts)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🔍 Overview

Medical Inventory Management System is a centralized inventory solution developed specifically for the healthcare sector.

Managing medical supplies manually can lead to several challenges, including unexpected stock shortages, expired medications, inaccurate inventory records, and inefficient stock tracking.

This system addresses these challenges by providing a centralized platform where users can monitor inventory, manage suppliers, track stock movements, and make data-driven decisions.

### 🎯 Project Goals

- Track inventory movements from Stock IN to Stock OUT.
- Monitor stock quantities and availability in real time.
- Identify low-stock and expiring medical supplies.
- Automate inventory alerts and notifications.
- Generate detailed reports and analytics.
- Use AI-powered predictions to support inventory planning.
- Provide secure access based on user roles.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration, login, and logout.
- JWT-based authentication.
- Role-Based Access Control (RBAC).
- Multiple user roles: Admin, Manager, Staff, and Viewer.
- Forgot password and password reset.
- Secure password hashing.

### 📦 Items Management
- Create, view, update, and delete inventory items.
- Search and filter items.
- Pagination for inventory records.
- Assign categories and suppliers.
- Monitor item availability using status indicators:
  - In Stock
  - Low Stock
  - Out of Stock
  - Expiring Soon

### 🏷️ Categories Management
- Create, update, view, and delete categories.
- Automatically track the number of items per category.
- Prevent deletion of categories containing associated items.

### 🏢 Suppliers Management
- Manage supplier information.
- Store contact details.
- Associate suppliers with inventory items.
- Perform supplier management operations.

### 📊 Stock Management
- Record Stock IN and Stock OUT transactions.
- Automatically update inventory quantities.
- Maintain stock movement history.
- Filter and review stock transactions.
- Generate automatic alerts when stock levels become low.

### 🔔 Alerts & Notifications
- Low-stock notifications.
- Out-of-stock alerts.
- Expiring-soon notifications.
- Dismiss and resolve alerts.
- Dashboard notification widget.

### 📈 Reports & Analytics
- Inventory reports.
- Stock movement reports.
- Interactive Bar, Line, and Pie charts.
- AI-powered usage predictions.
- Prediction confidence scores.
- Export reports to PDF.

### 🎨 Dashboard
- Centralized inventory dashboard.
- Key Performance Indicators (KPIs):
  - Total Items
  - Low Stock Items
  - Out-of-Stock Items
  - Total Suppliers
- Recent stock transactions.
- Quick navigation and shortcuts.
- Dark mode support.

### ⚙️ Settings
- Update user profile.
- Upload profile pictures.
- Manage application preferences.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | User Interface |
| TypeScript | Static Typing |
| Tailwind CSS | Styling and Responsive Design |
| Redux Toolkit | State Management |
| React Router v6 | Client-Side Routing |
| Axios | HTTP Requests |
| Recharts | Data Visualization |
| jsPDF | PDF Report Export |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| TypeScript | Static Typing |
| MongoDB | NoSQL Database |
| Mongoose | Database Modeling |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Nodemailer | Email Notifications |

---

## 📂 Project Structure

```text
medical-supplies/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── itemController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── supplierController.ts
│   │   │   ├── stockController.ts
│   │   │   ├── alertController.ts
│   │   │   └── reportController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Item.ts
│   │   │   ├── Category.ts
│   │   │   ├── Supplier.ts
│   │   │   ├── Stock.ts
│   │   │   └── Alert.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── itemRoutes.ts
│   │   │   ├── categoryRoutes.ts
│   │   │   ├── supplierRoutes.ts
│   │   │   ├── stockRoutes.ts
│   │   │   ├── alertRoutes.ts
│   │   │   └── reportRoutes.ts
│   │   ├── utils/
│   │   │   └── email.ts
│   │   └── app.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   ├── components/
│   │   └── ui/
│   ├── pages/
│   │   ├── auth/
│   │   ├── items/
│   │   ├── categories/
│   │   ├── suppliers/
│   │   ├── stock/
│   │   ├── alerts/
│   │   ├── reports/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   ├── store.ts
│   │   └── slices/
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or later).
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community).
- [Git](https://git-scm.com/).

### 1. Clone the Repository

```bash
git clone https://github.com/abdelrhmanMfouad/medical-supplies.git

cd medical-supplies
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend

npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medical_inventory
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Optional: Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

FRONTEND_URL=http://localhost:5173
```

**Important:** Replace the placeholder values with your actual configuration. Never commit your `.env` file to GitHub.

### 5. Start MongoDB

On Windows, open PowerShell as Administrator:

```powershell
net start MongoDB
```

Alternatively, start MongoDB manually:

```bash
mongod --dbpath C:\MongoDB\data
```

Make sure the database directory exists before running this command.

### 6. Run the Backend

From the `backend/` directory:

```bash
npm run dev
```

Backend server: `http://localhost:5000`

### 7. Run the Frontend

Open a new terminal, navigate to the project root, and run:

```bash
npm run dev
```

Frontend application: `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| PORT | Backend server port | Yes |
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT authentication | Yes |
| NODE_ENV | Application environment | Yes |
| EMAIL_USER | Email account for notifications | Optional |
| EMAIL_PASS | Email application password | Optional |
| FRONTEND_URL | Frontend application URL | Yes |

---

## 🔌 API Endpoints

The backend provides RESTful API endpoints for managing authentication, inventory, suppliers, stock movements, alerts, and reports.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset user password |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/upload-avatar` | Upload profile picture |

### Items

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items` | Retrieve all items |
| GET | `/api/items/:id` | Retrieve an item by ID |
| POST | `/api/items` | Create a new item |
| PUT | `/api/items/:id` | Update an existing item |
| DELETE | `/api/items/:id` | Delete an item |

### Other Modules

Additional REST API modules include:

- Categories Management
- Suppliers Management
- Stock Management
- Alerts & Notifications
- Reports & Analytics

For detailed endpoint specifications, refer to the backend source code.

---

## 👤 Demo Accounts

The following are example demo credentials. They should only be used if these accounts have been created and configured in your database.

| Role | Email | Password |
|---|---|---|
| Admin | admin@medical.com | password123 |
| Manager | manager@medical.com | password123 |
| Staff | staff@medical.com | password123 |

**Security Note:** Never use these example credentials in a production environment.

---

## 🤝 Contributing

Contributions, suggestions, bug reports, and feature requests are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Implement your changes.
4. Commit your changes.
5. Submit a Pull Request.

---

## 👨‍💻 Author

**Abdelrhman M. Fouad**

- GitHub: [@abdelrhmanMfouad](https://github.com/abdelrhmanMfouad)

---

## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to the teams and communities behind the technologies used in this project:

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- All open-source contributors.

---

⭐ **If you find this project useful, consider giving it a star on GitHub!**
