// Majority of logic was taken from weekly source codes from Erno Vanhala

const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("../model/Recipe");
const Category = require("../model/Category");
const router = express.Router();
const fs = require("fs");


let recipes = [];
let categories = [];

fs.readFile("./data/recipes.json", "utf-8", (err, data) => {
    if (err) {
        console.error("Something wrong with db:", err);
        return;
    }
    recipes = JSON.parse(data);
    console.log("Loaded recipe data\n", recipes);
});


// Load category information
fs.readFile("./data/categories.json", "utf-8", (err, data) => {
    if (err) {
        console.error("Something wrong with db:", err);
        return;
    }
    categories = JSON.parse(data);
    console.log("Loaded category data\n", recipes);
});


// Default
router.get("/", (req, res, next) => {
    return res.status(200).send("Hello Hello");
});

// categories
router.get("/categories/", async (req, res, next) => {
    try {
        const cats = await Category.find({});
        return res.status(200).json(cats);
    } catch (err) {
        console.error("Error: ", err);
        return res.status(404).send("No categories found.");

    }
});

// Adding recipe src: https://www.geeksforgeeks.org/mongoose-find-function/
router.post("/recipe/", async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({ name: req.body.name });
        if (recipe) {
            return res.status(403).send("Recipe exists already");
        }

        const recipe_json = {
            name: req.body.name,
            instructions: req.body.instructions,
            ingredients: req.body.ingredients,
            categories: req.body.categories
        }

        const newRecipe = await Recipe.create({
            name: req.body.name,
            instructions: req.body.instructions,
            ingredients: req.body.ingredients,
            categories: req.body.categories
        });

        return res.status(200).json(newRecipe);
    }
    catch (err) {
        console.error("Error produced: ", err);
        return next(err);
    }
});


router.get("/recipe/:id", async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({ name: req.params.id }).lean();

        if (recipe) {
            return res.status(200).json(recipe);
        }
        else {
            console.log("Recipe not found");
            return res.status(200).send("No recipe found");
        }
    } catch (err) {
        console.error("Failure while finding: ", err);
        return res.status(404).send("Something went wrong");
    }
});

module.exports = router;
