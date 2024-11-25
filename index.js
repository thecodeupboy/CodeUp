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

// Routes
app.use('/auth', authRouter); // Use the auth routes under the /auth path

app.get('/', (req, res) => {
    res.send(`<h1>Hello, ${req.user ? req.user.displayName : 'Guest'}</h1>
              <a href="/auth/google">Login with Google</a>`);
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


