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


function getUsersByName(req, res) {
    const { name } = req.query;

    let offset = Number(req.query.offset) || 0;
    Users.find({
        "name": { "$regex": name, "$options": "i" }
    })
        .skip(offset * 10).limit(10)
        .select("-NIF -address -zip_code -phone_number -phone_number2 -email -license_inscription_date -expiration_date -price")
        .then(dataset => {
            Users.countDocuments({ "name": { "$regex": name, "$options": "i" } }).then((count) => {
                res.send({
                    total: count,
                    res: dataset
                })
            })
                .catch(err => {
                    res.status(400).send(err);
                })
        })

        .catch(err => {
            res.status(404).send("Usuario no encontrado", err);
        })


}

function getUsersByClub(req, res) {

    const { club } = req.query;

    Users.find({ "club": { "$regex": club, "$options": "i" } })
        .then(dataset => {
            res.send(dataset);
        })
        .catch(err => {
            res.status(404).send("Club no encontrado", err);
        })
}

async function createUser(req, res) {
    let user = await Users.findOne({ affiliate_number: req.body.affiliate_number });

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

module.exports = { getUsers, getUsersByAffiliate, getUsersByName, getUsersByClub, createUser }