const dotenv = require('dotenv').config()
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const {
    ExtractJwt
} = require('passport-jwt')
const Admin = require('../models/adminModel')
const config = require('../../../config')[process.env.NODE_ENV]

/**
 * ADMIN
 */
passport.use('admin', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_TOKEN,
}, async (payload, done) => {
    try {

        const user = await Admin.findOne({
            _id: payload.id
        })

        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}));

const authAdmin = passport.authenticate('admin', {
    session: false,
});

module.exports = {
    authAdmin
}