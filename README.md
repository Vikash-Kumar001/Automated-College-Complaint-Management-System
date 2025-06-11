# 📚 College Complaint Management System

A full-stack web application for managing student complaints, with role-based dashboards for Students, Admins, and Resolvers.

---

## 🚀 Features

### Student
- Submit complaints (with file upload)
- View complaint status/history
- Rate resolved complaints (star rating + comment)
- Access support/help section and submit support requests

### Admin
- View/manage/assign/delete all complaints
- Forward complaints to resolvers
- Change complaint status
- View complaint stats (total, pending, in progress, resolved, forwarded)
- View all support/help requests from students

### Resolver
- View assigned complaints
- Update/revert complaint status (pending, in progress, resolved)
- View complaint stats

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT Auth
- **Other:** Framer Motion, React Icons

---

<<<<<<< HEAD
## ⚙️ Setup & Installation
=======
## 🧑‍💻 Tech Stack

| Frontend | Backend | Database | Styling | Animation |
|----------|---------|----------|---------|-----------|
| React.js | Node.js | MongoDB  | Tailwind CSS | Framer Motion |
| React Router | Express.js | Mongoose | Dark Mode (`dark:` classes) | |

---

## 🖥️ Dashboards

### 👨‍🎓 Student Dashboard
- Submit complaints with categories & description
- View live status (Pending, In-progress, Resolved)
- Get notified on status change or resolver comments

### 🛠️ Resolver Dashboard
- View and filter assigned complaints
- Mark as resolved with resolution comment
- Animated transitions for a modern UX

### 👑 Admin Dashboard
- View all complaints system-wide
- Assign resolvers to complaints
- Delete inappropriate or resolved complaints

---

## 📸 Screenshots

> ![image](https://github.com/user-attachments/assets/65c0c486-8de6-4144-b865-3f97ebf7dcaf)


📍 Student Dashboard 📍 Resolver Dashboard 📍 Admin Dashboard
+-------------------+ +---------------------+ +--------------------+
| [Complaint Form] | | [Filter: Pending 🔽] | | [Assign Resolver] |
| [Status: In-Prog] | | [Status: Resolved ✅] | | [Delete Button ❌] |
+-------------------+ +---------------------+ +--------------------+

yaml
Copy
Edit

---

## 🧪 Getting Started

### 📦 Installation
>>>>>>> 83d45f32b72128bebe01c99df5fab6cdf6818300

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. **Backend Setup**
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
# Example .env:
# MONGO_URI=mongodb://localhost:27017/complaint-system
# JWT_SECRET=your_jwt_secret
npm start
```

### 3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```
- The frontend runs on `http://localhost:3000`
- The backend runs on `http://localhost:5000`

---

## 🌐 Deployment Guide

### **Backend**
- Deploy to [Render](https://render.com/), [Heroku](https://heroku.com/), [Railway](https://railway.app/), or your own server.
- Set environment variables for `MONGO_URI` and `JWT_SECRET`.
- Update CORS settings if needed.

### **Frontend**
- Deploy to [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or your own server.
- Set the API base URL in `frontend/src/services/api.js` to your deployed backend URL.

---

## 📝 Usage

1. Register as a student, admin, or resolver (or seed users in the database).
2. Log in and use the dashboard according to your role.
3. Students can submit complaints, view status/history, rate resolved complaints, and submit support requests.
4. Admins can manage all complaints, assign to resolvers, view stats, and see support requests.
5. Resolvers can update complaint status and view their stats.

---

## 🛡️ Security

- JWT-based authentication for all roles
- Role-based access control for all endpoints

---

## 📧 Support

For any issues, use the in-app support/help section or contact the admin.

---

## 📦 License

MIT
