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


function updateUser(req,res) {

    const { _id } = req.params;
    
    Users.findOneAndUpdate(
        _id,
        req.body,
        {
        new: true ,
        useFindAndModify : false,
        runValidators : true
        }
    )
    .then(updatedUser =>{
        res.status(200).json({
            message: "Usuario Modificado",
            res: updatedUser
        })
    })
    .catch(error =>{
        res.status(404).json({
            message: "Ha ocurrido un error al actualizar el Usuario",
            error : error
        })
    })
}
function getUsersByNameSurname(req,res) {

    const { fullname } = req.query;

    let offset = Number(req.query.offset) || 0;

    Users.aggregate([
        {
        $addFields: {
            "fullname": {
                $concat: [ "$name", ' ', "$first_surname", ' ' , '$second_surname' ]
            }
        }
        },
        {
            $project: { 
                "_id": 0,
                "address": 0, 
                "zip_code": 0 , 
                "town": 0, 
                "NIF": 0 , 
                "Island": 0 ,
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
            $match: { "fullname": new RegExp(diacriticSensitiveRegex(fullname), 'i') },
        },
        {
            $facet : {
                total: [{ $count: "total"}],
                res: [{$skip : offset * 10}, {$limit : 10}]
            } 
        }
    ])
    .then(dataset =>{

        let data = {
            total : dataset[0].total[0].total,
            res : dataset[0].res
        }
        
        res.send(data);
        
    })
    .catch(error =>{
        console.log("Ha ocurrido un error ",error);
    })
}

// replace vowels with a regex which contains accents vowels
function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä]')
       .replace(/e/g, '[e,é,ë]')
       .replace(/i/g, '[i,í,ï]')
       .replace(/o/g, '[o,ó,ö,ò]')
       .replace(/u/g, '[u,ü,ú,ù]');
}

module.exports = { getUsers, getUsersByAffiliate, getUsersByNameSurname ,updateUser }