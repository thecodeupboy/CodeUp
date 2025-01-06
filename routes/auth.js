const express = require('express');
const passport = require('passport');
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/auth');

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

        let user = await User.findOne({ googleId });

        if (!user) {
            user = new User({
                googleId,
                name: displayName,
                email,
                profilePicture,
                status: 'active', // Default status, can be updated if needed
                roles: ['user'],  // Default role is 'user'
                createdDate: new Date()
            });
            await user.save();
        }

        return done(null, user);
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
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // After successful login, check the user's role and redirect accordingly
         if (req.user.roles.includes('creater')) {
            res.redirect('/createrDashboard');
        } else {
            res.redirect('/home');  // fallback if no roles matched
        }
    }
);


// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = router;
