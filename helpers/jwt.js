const JWT = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config')[process.env.NODE_ENV]
const Admin = require('../models/adminModel')

const createToken = (admin) => {
    let exp_token = moment().add(7, 'days').unix(); // current time + 7 day ahead
    return [
        JWT.sign({
            _id: admin._id,
            iat: moment().unix(), // current time
            exp: exp_token,
        }, config.SECRET_TOKEN),
        exp_token
    ]
}

const createRefreshToken = (admin) => {
    return JWT.sign({
        _id: admin._id,
        iat: moment().unix(), // current time
        exp: moment().add(15, 'days').unix(), // current time + 15 days ahead
    }, config.SECRET_REFRESH_TOKEN)
}

const refreshToken = (req, res) => {
    if (req.body.refresh_token && req.body.grant_type === 'refresh_token') {
        JWT.verify(req.body.refresh_token, config.SECRET_REFRESH_TOKEN, function(err, data) {
            if (err) {
                return res.status(400).send({
                    error: "TokenExpired"
                })
            }

            Admin.findOne({
                _id: data._id,
            }, (err, admin) => {
                if (err) {
                    return res.status(401).send({
                        error: "TokenExpired"
                    })
                }

                if (admin) {
                    let dataToken = createToken(admin)
                    res.status(200).send({
                        access_token: dataToken[0],
                        refresh_token: createRefreshToken(admin),
                        expires_in: dataToken[1]
                    })
                } else {
                    return res.status(401).send({
                        error: "TokenExpired"
                    })
                }

            })
        })
    } else {
        return res.status(400).send({
            error: "BadRequest"
        })
    }
}

module.exports = {
    createToken,
    createRefreshToken,
    refreshToken
}