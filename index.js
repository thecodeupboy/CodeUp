const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
require('./dbconnections/dbconnection');  // Make sure this file connects to your database

// Import routes
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');  // Auth routes for Google login

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your React frontend
}));

// Middleware for parsing URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to handle user sessions
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport.js for user authentication
app.use(passport.initialize());
app.use(passport.session());

// Importing JWT middleware
const { verifyToken } = require('./middleware/verifyToken');

// Protect routes based on roles and token validation
const checkAuthUser = (req, res, next) => {
  if (req.user.status === 'suspended') {
    return res.redirect('/userUnauthorised');
  }
  next();
};

const checkRole = (req, res, next) => {
  if (req.user.roles.includes('user')) {
    return res.redirect('/home');
  } else if (req.user.roles.includes('creater')) {
    return res.redirect('/createrDashboard');
  }
  next();
};

// Routes for authentication
app.use('/auth', authRouter);  // Use the auth routes under the /auth path

// Home page with Google login
app.get('/', (req, res) => {
  res.send(`<h1>Hello, ${req.user ? req.user.displayName : 'Guest'}</h1>
            <a href="/auth/google">Login with Google</a>
            <a href="/admin/users">Login as Admin</a>`);
});

// Protected home route
app.get('/home', checkAuthUser, (req, res) => {
  res.send('Welcome to Home page');
});

// Protected creator dashboard route
app.get('/createrDashboard', checkAuthUser, (req, res) => {
  res.send('Welcome to Creator Dashboard');
});

// Import and use other routers
app.use('/courses', require('./routes/courses'));
app.use('/lessons', require('./routes/lessons'));
app.use('/topics', require('./routes/topics'));
app.use(userRouter);
app.use('/admin', adminRouter);  // Admin routes protected with JWT

// Static files (e.g., images, thumbnails)
app.use(express.static('public'));
app.use('/thumbnails', express.static('public/thumbnails'));

// Set the view engine for rendering HTML pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
