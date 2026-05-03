![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
# ResQFood – Backend API

> **ResQFood is a scalable backend system built to reduce food wastage by connecting food donors (restaurants) with NGOs in real time.**

#### This repository contains the Node.js + Express + MongoDB backend, handling authentication(Email, Google OAuth), Payment Integration, Food Listings, Geo-based discovery, NGO coordination, Dashboard and Analytics and secure APIs and notifications(Nodemailer).

---

## 🚀 Features

- 🔐 Authentication - Email & Google OAuth (JWT + Cookies)
- 👤 Role-based access (NGO / Restaurant)
- 🍱 Food Post Management (Create, Claim, Collect, Expire)
- 📍 Location-based food discovery
- 💳 Payment Integration (Razorpay)
- 📊 Dashboard & Stats APIs
- ⏳ Background Jobs using Inngest :
  - Auto-expire food
  - Cleanup expired data
  - Handle pending claims
  - Subscription & trial expiry
- 📧 Email Notifications (Nodemailer)
- 🔌 Real-time updates via Socket.IO (room-based)

---

## 🏗️ Folder Structure

```
resqfood-backend/
│
├── node_modules/
│
├── src/
│ │
│ ├── config/
│ │ ├── cloudinary.js
│ │ └── database.js
│ │
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── foodController.js
│ │ ├── mapController.js
│ │ ├── paymentController.js
│ │ ├── statController.js
│ │ └── userController.js
│ │
│ ├── inngest/
│ │ ├── functions/
│ │ │ ├── cleanupExpiredFoods.js
│ │ │ ├── expireFoods.js
│ │ │ ├── expirePendingClaims.js
│ │ │ ├── expireUncollectedFood.js
│ │ │ ├── subscriptionExpiry.js
│ │ │ └── trialExpiry.js
│ │ │
│ │ ├── client.js
│ │ └── handler.js
│ │
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ ├── foodMiddleware.js
│ │ ├── socketMiddleware.js
│ │ ├── subscriptionMiddleware.js
│ │ └── upload.js
│ │
│ ├── models/
│ │ ├── claim.js
│ │ ├── foodPost.js
│ │ └── User.js
│ │
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── foodRoutes.js
│ │ ├── locationRoutes.js
│ │ ├── paymentRoutes.js
│ │ ├── statsRoutes.js
│ │ └── userRoutes.js
│ │
│ ├── socket/
│ │ └── socketHandler.js
│ │
│ ├── utils/
│ │ ├── emailTemplates.js
│ │ └── sendEmail.js
│ │
│ └── app.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- Inngest (background jobs)
- Razorpay (payments)
- Google OAuth
- Cloudinary & Multer
- Nodemailer
- ngRok

---

## 📦 Installation

```bash
git clone https://github.com/your-username/resqfood-backend.git
```

## Navigate

```bash
cd resqfood-backend
```

## Install dependencies

```bash
npm install
```

## Run server

```bash
npm run dev
```

---

## 🔐 Environment Variables (.env)

```env
PORT =
MONGO_URI =
JWT_SECRET =
JWT_TIMEOUT =
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
FRONTEND_URL =
GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =
RAZORPAY_KEY_ID =
RAZORPAY_SECRET =
RAZORPAY_WEBHOOK_SECRET =
INNGEST_SIGNING_KEY =
INNGEST_EVENT_KEY =
EMAIL_HOST =
EMAIL_PORT =
EMAIL_USER =
EMAIL_PASS =
EMAIL_FROM =
```

---

## 📡 API Endpoints

**Base URL :**

```bash
http://localhost:5000/api
```

---

## 🔐 Authentication (`/api/auth`)

| Method | Endpoint                 | Access    | Description           |
| ------ | ------------------------ | --------- | --------------------- |
| GET    | `/auth/google`           | Public    | Google OAuth login    |
| POST   | `/auth/signup`           | Public    | Register new user     |
| POST   | `/auth/login`            | Public    | Login user            |
| POST   | `/auth/logout`           | Protected | Logout user           |
| PUT    | `/auth/complete-profile` | Protected | Complete user profile |

---

## 👤 User (`/api/user`)

| Method | Endpoint       | Access    | Description      |
| ------ | -------------- | --------- | ---------------- |
| GET    | `/user/me`     | Protected | Get current user |
| PUT    | `/user/update` | Protected | Update profile   |
| DELETE | `/user/delete` | Protected | Delete account   |

---

## 🍱 Food (`/api/food`)

| Method | Endpoint                         | Access     | Description                 |
| ------ | -------------------------------- | ---------- | --------------------------- |
| POST   | `/food/create`                   | Restaurant | Create food post            |
| GET    | `/food/`                         | Protected  | Get all food                |
| GET    | `/food/nearby`                   | Protected  | Get nearby food             |
| GET    | `/food/restaurant/:restaurantId` | Protected  | Get restaurant posts        |
| GET    | `/food/ngo/claimed`              | NGO        | Get claimed foods           |
| POST   | `/food/claim/:id`                | NGO        | Claim food                  |
| POST   | `/food/accept`                   | Restaurant | Accept claim                |
| POST   | `/food/reject`                   | Restaurant | Reject claim                |
| POST   | `/food/collect`                  | NGO        | Mark as collected           |
| GET    | `/food/claims`                   | Restaurant | Restaurant claims dashboard |
| PUT    | `/food/:id`                      | Restaurant | Update food post            |
| DELETE | `/food/:id`                      | Restaurant | Delete food post            |

---

## 📍 Location (`/api/location`)

| Method | Endpoint           | Access    | Description          |
| ------ | ------------------ | --------- | -------------------- |
| POST   | `/location/update` | Protected | Update live location |

---

## 💳 Payment (`/api/payment`)

| Method | Endpoint           | Access           | Description             |
| ------ | ------------------ | ---------------- | ----------------------- |
| POST   | `/payment/order`   | Protected        | Create Razorpay order   |
| POST   | `/payment/webhook` | Public (Webhook) | Handle Razorpay webhook |

---

## 📊 Stats (`/api/stats`)

| Method | Endpoint         | Access     | Description   |
| ------ | ---------------- | ---------- | ------------- |
| GET    | `/stats/monthly` | Restaurant | Monthly stats |
| GET    | `/stats/impact`  | Restaurant | Impact stats  |
| GET    | `/stats/status`  | Restaurant | Status stats  |

---

## ⚙️ Inngest (`/api/inngest`)

| Method | Endpoint   | Access   | Description           |
| ------ | ---------- | -------- | --------------------- |
| POST   | `/inngest` | Internal | Inngest event handler |

---

## 🔐 Access Control

- **Public** → No authentication required
- **Protected** → Requires JWT authentication
- **Restaurant** → Only restaurant role
- **NGO** → Only NGO role

---

## 🧪 Notes

- Auth uses **JWT stored in cookies**
- Role-based access handled via middleware
- File uploads via **Multer + Cloudinary**
- Payments via **Razorpay**
- Background jobs via **Inngest**

---

## 🤝 Contributing

Contributions are welcome and appreciated! 🚀  
If you'd like to improve this project, follow the steps below.

### 🍴 Fork & Clone

```bash
# Fork the repository (click Fork button on GitHub)

# Clone your fork
git clone https://github.com/your-username/resqfood-backend.git

# Navigate into project
cd resqfood-backend
```

### Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 💻 Make Changes

- Follow existing code structure
- Write clean, readable code
- Add comments where necessary

### ✅ Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 🚀 Push to GitHub

```bash
git push origin feature/your-feature-name
```

---

### 🔁 Create Pull Request

- Go to your fork on GitHub
- Click "Compare & Pull Request"
- Add a clear description of your changes

### 📌 Contribution Guidelines

- Use meaningful commit messages
- Maintain consistent code style
- Avoid breaking existing features
- Test your changes before submitting

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

- Sreejib Nandy

---

## ⭐ Support

If you find this project helpful, consider giving it a ⭐ on GitHub!
