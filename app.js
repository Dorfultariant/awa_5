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
server.use(express.urlencoded({ extended: false }));

const PORT = 3000;


db.on("error", console.error.bind(console, "Oh no! MongoDB connection error: "));


server.use("/api/recipes", require("./api/recipes.js"));


server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});


