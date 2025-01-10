const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const path = require('path');

const { checkAuth } = require('./middleware/verifyUser');

const app = express();
require('./dbconnections/dbconnection'); 

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth'); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

// Home page with Google login
app.get('/', (req, res) => {
  res.send(`<h1>Hello, ${req.user ? req.user.displayName : 'Guest'}</h1>
            <a href="/auth/google">Login with Google</a>
            <a href="/admin/users">Login as Admin</a>`);
});

// Protected home route
app.get('/home', checkAuth, (req, res) => {
  res.send('Welcome to Home page');
});

// Protected creator dashboard route
app.get('/createrDashboard', checkAuth, (req, res) => {
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
