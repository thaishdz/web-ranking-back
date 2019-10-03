const mongoose = require('mongoose');
var validate = require('mongoose-validator');

const nameSurnameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name AND Surname should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: ['^[a-zA-Z-]+$', 'i'],
        message: 'Name AND Surname should contain letters only',
    }),
];


const nifValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$', 'i'],
        message: "NIF should be like 00000000Z"
    })
]




const userSchema = new mongoose.Schema({

    "affiliate_number": {
        type: String
    },
    "federation": {
        type: String,
        required: true
    },
    "club": {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true,
        validate: nameSurnameValidator
    },
    "first_surname": {
        type: String,
        required: true,
        validate: nameSurnameValidator
    },
    "second_surname": {
        type: String,
        validate: nameSurnameValidator
    },
    "fullName": {
        type: String
    },
    "NIF": {
        type: String,
        validate: nifValidator
    },
    "address": {
        type: String
    },
    "zip_code": {
        type: String
    },
    "town": {
        type: String
    },
    "Island": {
        type: String
    },
    "phone_number": {
        type: String
    },
    "phone_number2": {
        type: String
    },
    "email": {
        type: String
    },
    "birthdate": {
        type: String
    },
    "license_inscription_date": {
        type: String
    },
    "gender": {
        type: String
    },
    "specialty": {
        type: String
    },
    "boat": {
        type: String,
        required: true
    },
    "category": {
        type: String,
        required: true
    },
    "expiration_date": {
        type: String
    },
    "status": {
        type: String
    },
    "list_of_regattas": {
        type: Array
    }
});



module.exports = mongoose.model('regatistas', userSchema);
