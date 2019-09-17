const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');

var routes = require("./routes/routes.js");

const port = process.env.PORT || 3000;
var url = process.env.DB_URL;

server.use(cors());
server.use(express.json());

server.use("/", routes);

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