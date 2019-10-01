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
        arguments: ['^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$','i'],
        message: "NIF should be like 00000000Z"
    })
]




const userSchema = new mongoose.Schema({

    "affiliate_number": {
        type: String,
        required: true
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
        required: false,
        validate: nameSurnameValidator
    },
    "NIF": {
        type: String,
        required: true,
        validate: nifValidator
    },
    "address": {
        type: String,
        required: true
    },
    "zip_code": {
        type: String,
        required: true
    },
    "town": {
        type: String,
        required: true
    },
    "Island": {
        type: String,
        required: true
    },
    "phone_number": {
        type: String,
        required: true
    },
    "phone_number2": {
        type: String,
        required: false
    },
    "email": {
        type: String,
        required: true
    },
    "birthdate": {
        type: String,
        required: true
    },
    "license_inscription_date": {
        type: String,
        required: true
    },
    "gender": {
        type: String,
        required: true
    },
    "specialty": {
        type: String,
        required: true
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
        type: String,
        required: true
    },
    "status": {
        type: String,
        required: true
    },
    "list_of_regattas": {
        type: Array,
        required: true
    }
});



module.exports = mongoose.model('regatistas', userSchema);
