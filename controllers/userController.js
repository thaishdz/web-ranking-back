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


// function getUsersByName(req,res) {
//     const { name }  = req.query;
    
//     let offset = Number(req.query.offset) || 0;

//     Users.find({
//         "name": { "$regex": name, "$options": "i"}})
//         .skip(offset * 10).limit(10)
//         .select("-NIF -address -zip_code -phone_number -phone_number2 -email -license_inscription_date -expiration_date -price")
//         .then(dataset => {
//             Users.countDocuments({"name": { "$regex": name, "$options": "i"}})
//             .then((count) => {
//                 res.send({
//                     total: count,
//                     res: dataset
//                 })
//             })
//             .catch(err => {
//                 res.status(400).send(err);
//             })
//         })
        
//         .catch(err =>{
//             res.status(404).send("Usuario no encontrado",err);
//         })

        
// }


function getUsersByName(req,res) {

    const { fullname } = req.query;

    let offset = Number(req.query.offset) || 0;


    Users.aggregate([{
        $addFields: {
            "fullname": {
                $concat: [ "$name", ' ', "$first_surname", ' ' , '$second_surname' ]
            }
        }
        }, {
            $match: { "fullname": new RegExp(fullname, 'i') },
        },
        {
            $facet : {
                metadata: [{ $count: "total"}],
                data: [{$skip : offset * 10}, {$limit : 10}]
            } 
        }
    ])
    .then(dataset =>{
        
        res.send(dataset);
        
    })
    .catch(error =>{
        console.log("Ha ocurrido un error ",error);
    })
}


module.exports = { getUsers, getUsersByAffiliate, getUsersByName }