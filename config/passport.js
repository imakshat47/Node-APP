// To invoke Statergy
const GoogleStratergy = require('passport-google-oauth20').Strategy

// Mongoose
const mongoose = require('mongoose')

// User model
const USer = require('../models/User')
const User = require('../models/User')
const { use } = require('passport')

module.exports = function(passport) {
    passport.use(new GoogleStratergy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async(accessToken, refreshToken, profile, done) => {
            const newUSer = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                let user = await User.findOne({ googleId: profile.id })

                if (user) {
                    done(null, user)
                } else {
                    user = await USer.create(newUSer)

                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    });
}