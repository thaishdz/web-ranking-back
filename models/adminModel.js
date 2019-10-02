const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    reset_password_token: {
        type: String
    },
    reset_password_expires: {
        type: Date
    }
});

const generateHashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));
};

// Middleware, antes de guardar encriptar la contraseña
adminSchema.pre('save', function (next) {
    try {
        let user = this;

        if (!user.isModified('password')) return next();
        user.password = generateHashPassword(user.password);
        next();
    } catch (error) {
        next(error);
    }
});

// Funcion para comprobar la contraseña mediante bcrypt
adminSchema.methods.comparePassword = function (candidatePassword, hashPassword, cb) {
    //console.log("CONTRASEÑA ->  " + 'hashPassword: ' + hashPassword + 'candidatePassword: ' + candidatePassword + 'cb: ' + cb);
    bcrypt.compare(candidatePassword, hashPassword, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('administrators', adminSchema)