const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

var url = process.env.DB_URL;

const mongoose = require('mongoose');
server.use(cors());

let db = require('./model');

server.get("/", (req, res) => {
    let offset = Number(req.query.offset) || 0;
    db.find().skip(offset * 10).limit(10).then(result => {

        db.count().then((count) => {
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
});


server.listen(port, () => {
    console.log(`Server listening at ${port}`);

    mongoose.connect(url, { useNewUrlParser: true })
        .then(() => {
            console.log("Conexion Establecida con BD");
        })
        .catch(err => {
            console.log("Ha ocurrido un error", err);
        })

});