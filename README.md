# 📝 Blogsphere

A modern full-stack blogging platform built with the MERN stack, featuring user authentication, rich text editing, and a beautiful responsive interface.

## 🌐 Live Demo

**Experience Blogsphere live!**

🔗 **Frontend Application**: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)

🔗 **Backend API**: [https://blogsphere-sgud.onrender.com](https://blogsphere-sgud.onrender.com)

---

## ✨ Features
# 📝 Blogsphere

A modern full-stack blogging platform built with the MERN stack, featuring user authentication, rich text editing, and a beautiful responsive interface.

## 🌐 Live Demo

**Experience Blogsphere live!**

🔗 **Frontend Application**: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)

🔗 **Backend API**: [https://blogsphere-sgud.onrender.com](https://blogsphere-sgud.onrender.com)

⚠️ *Note: The first load may take 30–60 seconds due to Render cold start.*

---

## 📌 Overview

**Blogsphere** is a full-stack MERN blogging platform that enables users to create, publish, and manage blog posts with a rich text editor. The platform features **role-based access control** with **User** and **Admin** modules, providing a complete blogging experience with secure authentication and modern UI/UX.

---

## ✨ Key Features

### 📝 Blog Management

* Create, read, update, and delete blog posts
* Rich text editor for content formatting
* Blog categorization and tagging
* Responsive card-based blog display

### 🔐 User Authentication

* Secure signup and login with JWT authentication
* User profile management
* Protected routes and API endpoints
* Password encryption with bcrypt

### 👤 User Features

* Personal dashboard with blog statistics
* Create and manage own blog posts
* Edit profile information
* View all published blogs

### 🛠️ Admin Features

* Admin dashboard for content management
* User management and monitoring
* Analytics and reporting
* Blog moderation capabilities
* Export reports functionality

---

## 🖼️ Screenshots

### 🌐 Home Page

![Home Page](screenshots/homepage.png)

### 🔐 Authentication

![Login Page](screenshots/login.png)

![Signup Page](screenshots/signup.png)

### 👤 User Dashboard

![User Dashboard](screenshots/user_dashboard.png)

### ✍️ Blog Management

![Create Blog](screenshots/create_blog.png)

![Blog Detail](screenshots/blog_detail.png)

![All Blogs](screenshots/all-blogs.png)

### 🛠️ Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

![Admin Panel](screenshots/admin_panel.png)

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose            |
| ------------------- | ------------------ |
| React.js            | UI Development     |
| React Router        | Client-side Routing |
| Tailwind CSS        | Styling Framework  |
| Axios               | API Requests       |
| Rich Text Editor    | Content Formatting |
| **Deployed on Vercel** | **Frontend Hosting** |

### Backend

| Technology | Purpose        |
| ---------- | -------------- |
| Node.js    | Server Runtime |
| Express.js | API Framework  |
| MongoDB    | Database       |
| Mongoose   | ODM            |
| JWT        | Authentication |
| bcrypt     | Password Hashing |
| **Deployed on Render** | **Backend Hosting** |

### Deployment

| Service       | Usage                      |
| ------------- | -------------------------- |
| Vercel        | Frontend Hosting           |
| Render        | Backend API Hosting        |
| MongoDB Atlas | Cloud Database             |

---

## 📂 Project Structure

```bash
Blogsphere/
│── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File upload directory
│   ├── .env            # Environment variables (not tracked)
│   ├── server.js       # Express server setup
│   └── package.json    # Backend dependencies
│
│── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utility functions
│   │   ├── App.js      # Main App component
│   │   └── index.js    # Entry point
│   └── package.json    # Frontend dependencies
│
│── screenshots/        # Application screenshots
│── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RajalekshmiRe/Blogsphere.git
cd Blogsphere
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

### 4️⃣ Configure Environment Variables

The backend requires environment variables to run. Follow these steps:

#### Step 1: Copy the example file
```bash
cd backend
cp .env.example .env
```

#### Step 2: Get actual credentials
**Contact the project administrator** to get the actual MongoDB URI and JWT Secret values.

#### Step 3: Update your .env file

Open the `.env` file and replace the placeholder values:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/blogsphere?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long
NODE_ENV=development
```

**MongoDB Connection String Formats:**

- **For MongoDB Atlas (Cloud):**
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```
Example: `mongodb+srv://myuser:mypass123@cluster0.abcd123.mongodb.net/blogsphere?retryWrites=true&w=majority`

- **For Local MongoDB:**
```
mongodb://localhost:27017/blogsphere
```

**Important Security Notes:**
- ⚠️ **NEVER commit the `.env` file to Git** (it's already in `.gitignore`)
- ✅ The `.env.example` file is safe to commit (contains no real secrets)
- 🔐 Always get credentials through secure private channels
- 🔑 Generate a strong JWT secret (at least 32 characters)

### 5️⃣ Run the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

#### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

---

## 🔧 Available Scripts

### Backend

- `npm start` - Run the production server
- `npm run dev` - Run the development server with nodemon

### Frontend

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/signup   | Register a new user  |
| POST   | /api/auth/login    | Login user           |

### Blogs

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | /api/blogs         | Get all blog posts             |
| GET    | /api/blogs/:id     | Get a single blog post         |
| POST   | /api/blogs         | Create a new blog post (protected) |
| PUT    | /api/blogs/:id     | Update a blog post (protected) |
| DELETE | /api/blogs/:id     | Delete a blog post (protected) |

### User

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | /api/users/profile    | Get user profile (protected)   |
| PUT    | /api/users/profile    | Update user profile (protected)|

---

## 🚀 Deployment

This application is deployed and live with separate frontend and backend services:

### Frontend Deployment (Vercel)
- **Platform**: Vercel
- **URL**: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)
- **Features**: Automatic deployments from main branch, CDN distribution, SSL certificate

### Backend Deployment (Render)
- **Platform**: Render
- **URL**: [https://blogsphere-sgud.onrender.com](https://blogsphere-sgud.onrender.com)
- **Features**: Environment variables securely configured, automatic SSL, health monitoring
- **Note**: First request may take 30-60 seconds due to cold start on free tier

### Database
- **Platform**: MongoDB Atlas
- **Type**: Cloud-hosted NoSQL database
- **Features**: Automatic backups, monitoring, scalability

---

## 🔒 Security & Performance

* JWT authentication & authorization
* Password hashing with bcrypt
* Protected routes and API endpoints
* Input validation and sanitization
* CORS configuration
* Environment variable protection
* Optimized API responses
* Rate limiting on API endpoints

---

## 🎨 UI Features

* Responsive design for mobile, tablet, and desktop
* Modern and clean interface with Tailwind CSS
* Smooth animations and transitions
* User-friendly navigation
* Loading states and error handling
* Rich text editor for blog content
* Card-based blog layout

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string (Atlas) | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/blogsphere?retryWrites=true&w=majority` |
| `MONGO_URI` | MongoDB connection string (Local) | `mongodb://localhost:27017/blogsphere` |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) | `your_very_secure_secret_key_here_min_32_characters` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 🚀 Future Enhancements

* Comment system for blog posts
* Social media sharing integration
* Blog post search and filtering
* Categories and tags management
* User follow system
* Email notifications
* Blog post drafts
* Advanced text formatting options
* Image upload for blog posts
* Like and bookmark features

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 👩‍💻 Author

**Rajalekshmi Reji**

📧 Email: [rajalekshmireji07@gmail.com](mailto:rajalekshmireji07@gmail.com)  
💼 LinkedIn: [https://www.linkedin.com/in/rajalekshmi-reji](https://www.linkedin.com/in/rajalekshmi-reji)  
💻 GitHub: [https://github.com/RajalekshmiRe](https://github.com/RajalekshmiRe)  
🌐 Live Demo: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)

🎓 MCA Student | MERN Stack Developer | Full Stack Web Developer

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* Thanks to all contributors who help improve this project
* Inspired by modern blogging platforms like Medium and Dev.to
* Built with love using the MERN stack
* Special thanks to the open-source community

---

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository or contact via email.

---

⭐ **If you like this project, don't forget to star the repository!**

**Live at**: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)
### User Authentication
- 🔐 Secure signup and login with JWT authentication
- 👤 User profile management
- 🔒 Protected routes and API endpoints

### Blog Management
- ✍️ Create, read, update, and delete blog posts
- 📝 Rich text editor for formatting content
- 📱 Responsive design for all devices
- 🎨 Clean and modern UI with Tailwind CSS

### Admin Features
- 📊 Admin dashboard for content management
- 📈 Analytics and reporting
- 🔔 Notification system
- 📄 Export reports functionality

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building user interfaces
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Deployed on Vercel**

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Deployed on Render**

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/RajalekshmiRe/Blogsphere.git
cd Blogsphere
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

The backend requires environment variables to run. Follow these steps:

#### Step 1: Copy the example file
```bash
cd backend
cp .env.example .env
```

#### Step 2: Get actual credentials
**Contact the project administrator** to get the actual MongoDB URI and JWT Secret values.

#### Step 3: Update your .env file

Open the `.env` file and replace the placeholder values:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/blogsphere?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long
NODE_ENV=development
```

**MongoDB Connection String Formats:**

- **For MongoDB Atlas (Cloud):**
```
  mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```
  Example: `mongodb+srv://myuser:mypass123@cluster0.abcd123.mongodb.net/blogsphere?retryWrites=true&w=majority`

- **For Local MongoDB:**
```
  mongodb://localhost:27017/blogsphere
```

**Important Security Notes:**
- ⚠️ **NEVER commit the `.env` file to Git** (it's already in `.gitignore`)
- ✅ The `.env.example` file is safe to commit (contains no real secrets)
- 🔐 Always get credentials through secure private channels
- 🔑 Generate a strong JWT secret (at least 32 characters)

### 5. Run the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

#### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Blogsphere/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File upload directory
│   ├── .env            # Environment variables (not tracked)
│   ├── server.js       # Express server setup
│   └── package.json    # Backend dependencies
│
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utility functions
│   │   ├── App.js      # Main App component
│   │   └── index.js    # Entry point
│   └── package.json    # Frontend dependencies
│
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🔧 Available Scripts

### Backend

- `npm start` - Run the production server
- `npm run dev` - Run the development server with nodemon

### Frontend

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Blogs
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get a single blog post
- `POST /api/blogs` - Create a new blog post (protected)
- `PUT /api/blogs/:id` - Update a blog post (protected)
- `DELETE /api/blogs/:id` - Delete a blog post (protected)

### User
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## 🚀 Deployment

This application is deployed and live:

- **Frontend**: Deployed on Vercel with automatic deployments from the main branch
- **Backend**: Deployed on Render with environment variables securely configured
- **Database**: MongoDB Atlas for production data storage

Visit the live application at: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🎨 UI Features

- Responsive design for mobile, tablet, and desktop
- Modern and clean interface
- Smooth animations and transitions
- User-friendly navigation
- Loading states and error handling

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string (Atlas) | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/blogsphere?retryWrites=true&w=majority` |
| `MONGO_URI` | MongoDB connection string (Local) | `mongodb://localhost:27017/blogsphere` |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) | `your_very_secure_secret_key_here_min_32_characters` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Rajalekshmi Re**

- GitHub: [@RajalekshmiRe](https://github.com/RajalekshmiRe)
- Repository: [Blogsphere](https://github.com/RajalekshmiRe/Blogsphere)
- Live Demo: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by modern blogging platforms
- Built with love using the MERN stack

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

⭐ If you found this project helpful, please give it a star on GitHub!

**Live at**: [https://blogging-platform-ecru.vercel.app](https://blogging-platform-ecru.vercel.app)
