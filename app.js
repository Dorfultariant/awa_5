const express = require("express");
const mongoose = require("mongoose");

// const mongoDB = process.env.MONGO_URL;
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

const server = express();

server.use(express.static("public"));
server.use(express.json());

const PORT = 3000;


db.on("error", console.error.bind(console, "MongoDB connection error"));


server.get("/", function(req, res, next) {
    res.send("Hello there");
});


server.get("/recipe/:food", function(req, res, next) {
    try {

        const food = req.params.food;


        res.status(200).json({ name: `${food}`, instructions: "Just DO IT", ingredients: "What ever you have" });
    } catch (error) {
        console.error("Error produced from recipe path: ", error);
    }

});

server.post("/recipe/", require("./api/recipe.js"));



server.post("/images", function(req, res, next) {
    try {
        res.status(200).json({ msg: "Hi" });

    } catch (error) {
        console.error("Error produced from recipe path: ", error);
    }

});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});


