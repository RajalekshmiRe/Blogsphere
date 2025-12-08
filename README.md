# 📝 Blogsphere

A modern full-stack blogging platform built with the MERN stack, featuring user authentication, rich text editing, and a beautiful responsive interface.

## ✨ Features

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

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

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

Create a `.env` file in the `backend` directory:

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

**Important Notes:**
- Replace `<username>` and `<password>` with your actual MongoDB credentials
- Replace `<cluster-url>` with your Atlas cluster URL
- Replace `<database-name>` with your database name (e.g., `blogsphere`)
- **Never commit** the `.env` file to Git (it's already in `.gitignore`)
- Generate a strong JWT secret (at least 32 characters)

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

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by modern blogging platforms
- Built with love using the MERN stack

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

⭐ If you found this project helpful, please give it a star on GitHub!
