const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();

// Passport Google Authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        const googleId = profile.id;
        const displayName = profile.displayName || 'Unknown User';
        const email = profile.emails && profile.emails[0] && profile.emails[0].value || 'no-email@example.com';
        const profilePicture = profile.photos[0] ? profile.photos[0].value : 'default-image-url';

        try {
            let user = await User.findOne({ googleId });

            if (!user) {
                user = new User({
                    googleId,
                    name: displayName,
                    email,
                    profilePicture,
                    status: 'active', // Default status
                    roles: ['user'],  // Default role
                    createdDate: new Date()
                });
                await user.save();
            }

            // Create JWT token
            const token = jwt.sign(
                { userId: user._id, roles: user.roles },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log('Generated JWT Token:', token);

            // Check for user status
            if (user.status === 'suspended') {
                return done(null, false, { message: 'User suspended' });
            }

            return done(null, { user, token });

        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Google authentication route
router.get('/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

// Google callback route
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth' }),
    (req, res) => {
        if (req.user.status === 'suspended') {
            return res.status(403).send('User is suspended.');
        }

        // Set JWT token in HttpOnly cookie
        res.cookie('authToken', req.user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Ensure it's only sent over HTTPS in production
            sameSite: 'Lax', // Helps prevent CSRF attacks
            maxAge: 60 * 60 * 1000
        });

        // Send user info
        res.json({
            message: 'Authentication successful!',
            user: req.user.user
        });
    }
);

// Logout route
router.get('/logout', (req, res, next) => {
    res.clearCookie('authToken');  // Clear the auth token from cookies
    res.redirect('/auth');
});

router.get('/', (req, res) => {
  res.send(`<h1>Hello, ${req.user ? req.user.displayName : 'Guest'}</h1>
            <a href="/auth/google">Login with Google</a>`);
});



module.exports = router;
