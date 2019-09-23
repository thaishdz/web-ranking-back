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


function getUsersByName(req,res) {
    const { name }  = req.query;
    Users.find({"name": { '$regex' : name, '$options' : 'i'}})
        .then(dataset => {
            res.send(dataset);
        })
        .catch(err =>{
            res.status(404).send("Usuario no encontrado",err);
        })
}

function getUsersByClub(req,res) {
    
    const { club }  = req.query;
    Users.find({"club": club.toUpperCase()})
        .then(dataset =>{
            res.send(dataset);
        })
        .catch(err =>{
            res.status(404).send("Club no encontrado",err);
        })
}

module.exports = { getUsers, getUsersByAffiliate, getUsersByName , getUsersByClub }