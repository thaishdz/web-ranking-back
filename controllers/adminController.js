const Admin = require("../models/adminModel");
const authJWT = require('../helpers/jwt');
const path = require('path');
const async = require('async');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const hbs = require('nodemailer-express-handlebars'),
    email = process.env.MAILER_EMAIL_ID || 'direccion_correo',
    pass = process.env.MAILER_PASSWORD || 'contra_correo'
nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'servicio_correo',
    auth: {
        user: email,
        pass: pass
    }
});

const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: '../templates/',
        layoutsDir: '../templates/',
        defaultLayout: '',
    },
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));


const responseToken = (admin) => {
    let dataToken = authJWT.createToken(admin);
    let adminResponse = {
        access_token: dataToken[0],
        refresh_token: authJWT.createRefreshToken(admin),
        expires_in: dataToken[1]
    };
    return adminResponse;
}

function signUpAdmin(req, res) {
    // Save new admin
    Admin.create(req.body)
        .then(admin => {
            return res.status(200).send(responseToken(admin));

        })
        .catch(err => {
            return res.status(400).send(err);
        });
}

function loginAdmin(req, res) {
    if (req.body.password && req.body.name) {
        Admin.findOne({
            name: req.body.name
        })
            .select("_id password")
            .exec((err, userResult) => {
                if (err || !userResult) {
                    return res.status(401).send({ error: "LoginError" });
                }
                userResult.comparePassword(req.body.password, userResult.password, function (err, isMatch) {

                    if (isMatch && !err) {
                        return res.status(200).send(responseToken(userResult))
                    } else {
                        return res.status(401).send({ error: "LoginError" });
                    }
                });
            });
    } else {
        return res.status(401).send({ error: "BadRequest" });
    }
}

function reset_password(req, res, next) {
    Admin.findOne({
        reset_password_token: req.body.data.token,
        reset_password_expires: {
            $gt: Date.now()
        }
    }).exec(function (err, user) {
        if (!err && user) {
            if (req.body.data.newPassword === req.body.data.verifyPassword) {
                user.password = req.body.data.newPassword;
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;
                user.save(function (err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        var data = {
                            to: user.email,
                            from: email,
                            template: 'reset-password-email',
                            subject: 'Confirmación de la recuperación',
                            context: {
                                name: user.name
                            }
                        };
                        smtpTransport.sendMail(data, function (err) {
                            if (!err) {
                                return res.json({ message: 'Contraseña cambiada' });
                            } else {
                                return done(err);
                            }
                        });
                    }
                });
            } else {
                return res.status(422).send({
                    message: 'Las contraseñas no coinciden'
                });
            }
        } else {
            return res.status(400).send({
                message: 'El token no es válido o expiró.'
            });
        }
    });
}

function forgot_password(req, res) {
    async.waterfall([
        function (done) {
            Admin.findOne({
                email: req.body.email
            }).exec(function (err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('Administrador no encontrado');
                }
            });
        },
        function (user, done) {
            // create the random token
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function (user, token, done) {
            Admin.findByIdAndUpdate(
                { _id: user._id },
                { reset_password_token: token, reset_password_expires: Date.now() + 86400000 },
                { upsert: true, new: true }
            )
                .exec(function (err, new_user) {
                    done(err, token, new_user);
                });
        },
        function (token, user, done) {
            var data = {
                to: user.email,
                from: email,
                template: 'forgot-password-email',
                subject: '¡Recupera tu contraseña!',
                context: {
                    url: 'https://web-ranking-back.herokuapp.com/auth/reset_password?token=' + token,
                    name: user.name
                }
            };

            smtpTransport.sendMail(data, function (err) {
                if (!err) {
                    return res.json({ message: 'Revisa tu correo y sigue las instrucciones' });
                } else {
                    res.status(400).send(err);
                    return done(err);
                }
            });
        }
    ], function (err) {
        return res.status(422).json({ message: err });
    });
}

function render_reset_password_template(req, res) {
    return res.sendFile(path.resolve('./public/reset-password.html'));
};


module.exports = { loginAdmin, signUpAdmin, reset_password, forgot_password, render_reset_password_template }