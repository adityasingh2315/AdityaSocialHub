# AdityaSocialHub

AdityaSocialHub is a full-stack social media web application built by [Aditya Singh](https://github.com/adityasingh2315), inspired by platforms like Instagram.  
It allows users to register, log in, post images with captions, like and comment on posts, and follow/unfollow other users.

---

## 🚀 Features

- 🔐 User Authentication (Register/Login)
- 🖼️ Upload Posts with Image + Caption
- ❤️ Like & 💬 Comment on Posts
- 🔁 Follow / Unfollow Users
- 👥 "Who to Follow" Suggestions
- 📱 Responsive UI

---

## ⚙️ Tech Stack

| Frontend     | Backend   | Database | Other            |
|--------------|-----------|----------|------------------|
| React        | Node.js   | MongoDB  | Tailwind CSS     |
| Axios        | Express   | Mongoose | Multer (uploads) |
| React Router |           |          | Socket.io (ready)|

---

## 📸 Screenshots

> Sample uploaded images:

![Post Example 1](uploads/1752237035498.jpg)  
![Post Example 2](uploads/1752236483238.jpg)

---

## 🔧 Local Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/adityasingh2315/AditySocialHub.git




Install backend dependencies
cd server
npm install



Create a .env file inside server/ with the following content:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret




Start the backend server
npm start





Frontend setup (if created):

If your frontend is in a client/ folder:



cd client
npm install
npm start
📂 Project Structure (server)

Copy
Edit
server/
├── controllers/
│   ├── postController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Chat.js
├── routes/
│   ├── userRoutes.js
│   ├── postRoutes.js
│   └── chatRoutes.js
├── uploads/           # Stores uploaded post images
├── server.js
└── .env


🙋‍♂️ Author
Made with ❤️ by Aditya Singh

⭐ GitHub Link
https://github.com/adityasingh2315/AditySocialHub


