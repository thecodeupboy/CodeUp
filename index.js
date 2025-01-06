const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const cors = require('cors');

const app = express();
require('./dbconnections/dbconnection');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth'); // Import the new auth routes


app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React app
}));


app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Middleware to check if the user is authorized (active or suspended)
const checkAuthUser = (req, res, next) => {
    if (req.user.status === 'suspended') {
        return res.redirect('/userUnauthorised');
    }
    next();
};

// Middleware to check user roles and redirect accordingly
const checkRole = (req, res, next) => {
    if (req.user.roles.includes('user')) {
        return res.redirect('/home');
    } else if (req.user.roles.includes('creater')) {
        return res.redirect('/createrDashboard');
    }
    next();
};

// Routes
app.use('/auth', authRouter); // Use the auth routes under the /auth path

app.get('/', (req, res) => {
    res.send(`<h1>Hello, ${req.user ? req.user.displayName : 'Guest'}</h1>
              <a href="/auth/google">Login with Google</a>
              <a href="/admin/users">Login with Google</a>`);
});

// Protect routes based on user role
app.get('/home',checkAuthUser, (req, res) => {
    res.send('Welcome to Home page');
});

app.get('/createrDashboard',checkAuthUser, (req, res) => {
    res.send('Welcome to Creator Dashboard');
});

// Other Routes
app.use('/courses', require('./routes/courses'));
app.use('/lessons', require('./routes/lessons'));
app.use('/topics', require('./routes/topics'));
app.use(userRouter);
app.use('/admin', adminRouter);
app.use(express.static('public'));
app.use('/thumbnails', express.static('public/thumbnails'));
app.set('view engine', 'ejs');

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


