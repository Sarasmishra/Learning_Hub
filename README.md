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
- React  
- Redux Toolkit (RTK Query)  
- Tailwind CSS  
- Shadcn/UI  
- React Router DOM  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB & Mongoose  

**Cloud & Payment Services:**  
- Cloudinary (media storage)  
- Stripe (payments & webhooks)  

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







