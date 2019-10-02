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
                    console.log("Esta saliendo por aquí 1");
                    return res.status(401).send({ error: "LoginError" });
                }
                userResult.comparePassword(req.body.password, userResult.password, function (err, isMatch) {

                    if (isMatch && !err) {
                        return res.status(200).send(responseToken(userResult))
                    } else {
                        console.log("Esta saliendo por aquí 2");
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
        // console.log('LLEGO 1');
        // console.log('USER: ' + user);
        // console.log('El token llegado es: ' + req.body.data.token);
        // console.log('El newPassword llegado es: ' + req.body.data.newPassword);
        // console.log('El verifyPassword llegado es: ' + req.body.data.verifyPassword);
        // console.log("El err vale: " + err);
        // console.log("El user vale: " + user);

        if (!err && user) {
            if (req.body.data.newPassword === req.body.data.verifyPassword) {
                console.log('LLEGO 2');
                //user.password = bcrypt.hashSync(req.body.data.newPassword, bcrypt.genSaltSync(10));
                user.password = req.body.data.newPassword;
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;
                user.save(function (err) {
                    console.log('LLEGO 3');
                    if (err) {
                        console.log('LLEGO 4');
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        console.log('LLEGO 5');
                        var data = {
                            to: user.email,
                            from: email,
                            template: 'reset-password-email',
                            subject: 'Password Reset Confirmation',
                            context: {
                                name: user.name
                            }
                        };
                        console.log('LLEGO 6');
                        smtpTransport.sendMail(data, function (err) {
                            if (!err) {
                                console.log('LLEGO 7');
                                return res.json({ message: 'Password reset' });
                            } else {
                                console.log('LLEGO 8');
                                return done(err);
                            }
                        });
                    }
                });
            } else {
                console.log('LLEGO 9');
                return res.status(422).send({
                    message: 'Passwords do not match'
                });
            }
        } else {
            console.log('LLEGO 10');
            return res.status(400).send({
                message: 'Password reset token is invalid or has expired.'
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
                    done('Admin not found.');
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
            console.log("Llego!!!");

            var data = {
                to: user.email,
                from: email,
                template: 'forgot-password-email',
                subject: 'Password help has arrived!',
                context: {
                    url: 'http://3f623f25.ngrok.io/auth/reset_password?token=' + token,
                    name: user.name
                }
            };

            smtpTransport.sendMail(data, function (err) {
                if (!err) {
                    return res.json({ message: 'Revisa tu correo y sigue las instrucciones' });
                } else {
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