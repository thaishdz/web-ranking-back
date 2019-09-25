const Admin = require("../models/adminModel");
const authJWT = require('../helpers/jwt');

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
                    //console.log("Contra: " + userResult.password);

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


module.exports = { loginAdmin, signUpAdmin }