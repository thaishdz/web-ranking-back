var Users = require("../models/userModel");

function getUsers(req, res) {
    let offset = Number(req.query.offset) || 0;
    Users.find().skip(offset * 10).limit(10)
        .select("-NIF -address -zip_code -phone_number -phone_number2 -email -license_inscription_date -expiration_date -price")
        .then(result => {
            Users.countDocuments().then((count) => {
                res.send({
                    total: count,
                    res: result
                })
            })
                .catch(err => {
                    res.status(400).send(err);
                })
        }).catch(err => {
            res.status(400).send(err);
        })
}

function getUsersByAffiliate(req, res) {
    Users.find({ _id: req.params._id })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.send(err);
        });
}


function getUsersByNameSurname(req, res) {
    const { fullName } = req.query;
    let offset = Number(req.query.offset) || 0;
    Users.aggregate([
        {
            $addFields: {
                "fullName": {
                    $concat: ["$name", ' ', "$first_surname", ' ', '$second_surname']
                }
            }
        },
        {
            $project: {
                "_id": 0,
                "address": 0,
                "zip_code": 0,
                "town": 0,
                "NIF": 0,
                "Island": 0,
                "phone_number": 0,
                "phone_number2": 0,
                "email": 0,
                "birthdate": 0,
                "license_inscription_date": 0,
                "expiration_date": 0,
                "price": 0,
                "status": 0,
            }
        },

        {
            $match: { "fullName": new RegExp(diacriticSensitiveRegex(fullName), 'i') },
        },
        {
            $facet: {
                total: [{ $count: "total" }],
                res: [{ $skip: offset * 10 }, { $limit: 10 }]
            }
        }
    ]).then(dataset => {

        let data = {
            total: dataset[0].total[0].total,
            res: dataset[0].res
        }

        res.send(data);

    }).catch(error => {
        res.status(404).send(error);
    })
}

function updateUser(req, res) {

    const { _id } = req.params;

    Users.findOneAndUpdate(
        _id,
        req.body,
        {
            new: true,
            useFindAndModify: false,
            runValidators: true
        }
    )
        .then(updatedUser => {
            res.status(200).json({
                message: "Usuario Modificado",
                res: updatedUser
            })
        })
        .catch(error => {
            res.status(404).json({
                message: "Ha ocurrido un error al actualizar el Usuario",
                error: error
            })
        })
}

async function createUser(req, res) {
    // Antes estaba con affilitate_number
    let user = await Users.findOne({ name: req.body.name, first_surname: req.body.first_surname, second_surname: req.body.second_surname });

    if (user) {
        return res.status(400).send('Este regatista ya existe');
    } else {
        user = new Users({
            affiliate_number: req.body.affiliate_number,
            federation: req.body.federation,
            club: req.body.club,
            name: req.body.name,
            first_surname: req.body.first_surname,
            second_surname: req.body.second_surname,
            fullName: req.body.fullName,
            NIF: req.body.NIF,
            address: req.body.address,
            zip_code: req.body.zip_code,
            town: req.body.town,
            Island: req.body.Island,
            phone_number: req.body.phone_number,
            phone_number2: req.body.phone_number2,
            email: req.body.email,
            birthdate: req.body.birthdate,
            license_inscription_date: req.body.license_inscription_date,
            gender: req.body.gender,
            specialty: req.body.specialty,
            boat: req.body.boat,
            category: req.body.category,
            expiration_date: req.body.expiration_date,
            price: req.body.price,
            status: req.body.status,
            expiration_date: req.body.expiration_date,
            price: req.body.price,
            list_of_regattas: req.body.list_of_regattas
        });
        await user.save();
        res.send(user);
    }
}


// replace vowels with a regex which contains accents vowels
function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä]')
        .replace(/e/g, '[e,é,ë]')
        .replace(/i/g, '[i,í,ï]')
        .replace(/o/g, '[o,ó,ö,ò]')
        .replace(/u/g, '[u,ü,ú,ù]');
}

module.exports = { getUsers, getUsersByAffiliate, getUsersByNameSurname, updateUser, createUser }



