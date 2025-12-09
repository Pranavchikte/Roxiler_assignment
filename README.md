# 🛒 Store Management System (SaaS Platform)

> A robust, multi-vendor store management platform built with **Node.js (Express)** and **React**. Featuring Role-Based Access Control (RBAC), atomic database operations, and a minimalist "Notion-style" grayscale UI.

## 🚀 Key Features

* **🔐 Role-Based Authentication:** Secure JWT implementation distinguishing between `Admin`, `Store Owner`, and `User`.
* **⚡ Atomic Data Integrity:** "All-or-Nothing" transaction logic. If Store creation fails, the linked User account is automatically rolled back to prevent orphan records.
* **📊 Admin Dashboard:** Real-time statistics monitoring (Total Users, Stores, Ratings) with a minimalist UI.
* **🛡️ Security First:** Bcrypt password hashing, JWT payload validation, and protected middleware routes.
* **🎨 Minimalist UI:** Designed with a strict grayscale aesthetic using React, Tailwind CSS, and Shadcn/ui.

## 🛠️ Tech Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JSON Web Token (JWT) + BcryptJS

### Frontend
* **Framework:** React.js
* **Styling:** Tailwind CSS (Grayscale/Monochrome theme)
* **Components:** Shadcn/ui + Lucide Icons
* **HTTP Client:** Axios

---
