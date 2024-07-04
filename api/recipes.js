// Majority of logic was taken from weekly source codes from Erno Vanhala

const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("../model/Recipe");
const router = express.Router();
const fs = require("fs");


let recipes = [];

fs.readFile("./data/recipes.json", "utf-8", (err, data) => {
    if (err) {
        console.error("Something wrong with db:", err);
        return;
    }
    recipes = JSON.parse(data);
    console.log("Loaded data\n", recipes);
});


// Default
router.get("/", (req, res, next) => {
    return res.status(200).send("Hello Hello");
});

// Adding recipe src: https://www.geeksforgeeks.org/mongoose-find-function/
router.post("/recipe/", async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({ name: req.body.name });
        if (recipe) {
            return res.status(403).send("Recipe exists already");
        }

        const newRecipe = await Recipe.create({
            name: req.body.name,
            instructions: req.body.instructions,
            ingredients: req.body.ingredients
        });

        return res.status(200).json(newRecipe);
    }
    catch (err) {
        console.error("Error produced: ", err);
        return next(err);
    }
});

/*
router.post("/recipe/", (req, res, next) => {
    console.log("Trying the recipe");
    Recipe.find({ name: req.body.name }, function(err, recipe) {
        if (err) {
            console.log("Found an error in post");
            return next(err);
        }
        if (!recipe) {
            new Recipe({
                name: req.body.name,
                instructions: req.body.instructions,
                ingredients: req.body.ingredients
            }).save((err) => {
                if (err) return next(err);
                return res.send(req.body);
            });
        }
        else {
            return res.status(403).send("Already that recipe");
        }
    });
});*/

router.get("/recipe/:id", (req, res, next) => {
    Recipe.find({ name: req.params.id }, (err, recipe) => {
        if (err) {
            console.error("get error: ", err);
            return next(err);
        }
        if (recipe) {
            console.log(recipe);
            res.status(200).json(recipe);
        }
        else {
            console.log("Recipe not found");
            res.status(200).json({ msg: "No recipe found" });
        }
    });
});

module.exports = router;
