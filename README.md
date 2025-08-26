# 🎓 Learning Hub

Learning Hub is a full-stack **online learning platform** built with the **MERN stack**.  
It provides a seamless way for users to explore, purchase, and learn courses, while enabling admins/instructors to create, manage, and sell courses.

---

## 🚀 Features

- 🔐 **Authentication & Authorization** – Secure signup/login using JWT & bcrypt.  
- 👤 **User Profiles** – Update personal info & track course progress.  
- 🎥 **Course Management** – Admins can add, edit, publish/unpublish courses.  
- 📂 **Video Uploads** – Cloudinary integration for secure video & image hosting.  
- 🛒 **Payments** – Integrated **Stripe** for secure checkout & course purchases.  
- 📊 **Dashboard** – Manage purchased courses & admin statistics.  
- 🔍 **Search & Filters** – Find courses easily with advanced filters.  
- 🌙 **Light/Dark Mode** – Built with **shadcn/ui** for modern UI/UX.  
- ⚡ **Redux Toolkit (RTK Query)** – State management & API integration.  

---
## 🛠️ Tech Stack

**Frontend:**
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

**Backend:**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

**Database:**
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**Other Integrations:**
- ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Sarasmishra/Learning_Hub.git
cd Learning_Hub

```

### 2. Install Dependencies

```
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

```

### 3. Setup Environment Variables

**Create a .env file inside the server folder and add:**
```
MONGO_URI=your_mongodb_uri
PORT=3005
SALT_ROUND=10
SECRET_KEY=your_secret_key

# Cloudinary setup
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
CLOUD_NAME=your_cloud_name

# Stripe setup
STRIPE_SECRET_KEY=your_secret_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
WEBHOOK_ENDPOINT_SECRET=your_webhook_secret
```

### 4. Run the Project
```
# Start backend
cd server
npm run dev

# Start frontend (in another terminal)
cd client
npm start
```

## 🎯 Screenshots

### 1.Home
<img width="1799" height="879" alt="Screenshot 2025-08-26 125318" src="https://github.com/user-attachments/assets/ccf9e437-4584-4f7e-8ecf-626f0994d7b6" />

### 2. Course Detail Page
<img width="1696" height="877" alt="Screenshot 2025-08-26 125531" src="https://github.com/user-attachments/assets/b386502d-9c32-4332-907f-b98d36698f63" />

### 3. Dashboard(Instructor)
<img width="1570" height="865" alt="Screenshot 2025-08-26 125744" src="https://github.com/user-attachments/assets/85ded30f-f279-438d-b7dd-52204225bf5e" />

### 4. All courses(Dashboard)
<img width="1443" height="863" alt="Screenshot 2025-08-26 125859" src="https://github.com/user-attachments/assets/0d7a186b-dce8-436a-93d1-c1dc7d37d6ac" />

### 5. Course Creation
<img width="1467" height="870" alt="Screenshot 2025-08-26 130017" src="https://github.com/user-attachments/assets/06ef67bf-e3e8-4655-8317-9e86adf10c86" />

### 6. Assignment Page
<img width="1545" height="863" alt="Screenshot 2025-08-26 130452" src="https://github.com/user-attachments/assets/c451b03e-11f2-436c-b824-5c1c5baaf743" />

### 7. Payment Gateway
<img width="1313" height="872" alt="Screenshot 2025-08-26 130304" src="https://github.com/user-attachments/assets/bdf90727-fdfe-46da-89d5-2614d11fc8d5" />

---

## 🧪 API Endpoints (Sample)

| Method | Endpoint                               | Description                    |
| ------ | -------------------------------------- | ------------------------------ |
| POST   | `/api/auth/register`                   | Register a new user            |
| POST   | `/api/auth/login`                      | Login user & get token         |
| GET    | `/api/courses`                         | Fetch all published courses    |
| POST   | `/api/courses`                         | Add a new course (Admin)       |
| POST   | `/api/payment/create-checkout-session` | Create Stripe checkout session |

---

## 📊 Project Status
- ✅ Backend Completed
- ✅ Frontend Completed
- ⚡ Currently adding new features and improving UI
  

🙏 Thank You

Thank you for your time ✨
If you liked this project, don’t forget to ⭐ the repo!







