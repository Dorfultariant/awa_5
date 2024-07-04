const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();


// const mongoDB = process.env.MONGO_URL;
const mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB);

mongoose.Promise = Promise;
const db = mongoose.connection;

const server = express();

server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

db.on("error", console.error.bind(console, "Oh no! MongoDB connection error: "));


server.use("/api/recipes", require("./api/recipes.js"));



server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}...`);
});


