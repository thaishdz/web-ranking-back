const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');

var routes = require("./routes/routes.js");

const port = process.env.PORT || 3000;
//const url = process.env.DB_URL;
const connectionString = process.env.MONGO_ATLAS_URL;

var options = {
    inflate: true,
    limit: '100kb',
    type: '*/*'
};

var bodyParser = require('body-parser');

app.use(bodyParser.raw(options));

server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }))

server.use("/", routes);

server.listen(port, () => {
    console.log(`Server listening at ${port}`);

    mongoose.connect(connectionString)
        .then(() => {
            console.log("Conexion Establecida con BD");
        })
        .catch(err => {
            console.log("Ha ocurrido un error", err);
        })
});