const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();


const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);

mongoose.Promise = Promise;
const db = mongoose.connection;

const server = express();

server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

db.on("error", console.error.bind(console, "Oh no! MongoDB connection error: "));


server.use("/api/recipes", require("./api/recipes.js"));

server.post("/recipe/", function(req, res, next) {
    try {
        const recipe = {
            "name": req.body.name,
            "ingredients": req.body.ingredients,
            "instructions": req.body.instructions
        };

        res.status(200).json(recipe);
    } catch (error) {
        console.error("Error produced from recipe path: ", error);
    }

});


server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}...`);
});


