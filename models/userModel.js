const mongoose = require('mongoose');

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
        required: true
    },
    "first_surname": {
        type: String,
        required: true
    },
    "second_surname": {
        type: String,
        required: false
    },
    "NIF": {
        type: String,
        required: true
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
    }
});

module.exports = mongoose.model('regatistas', userSchema);