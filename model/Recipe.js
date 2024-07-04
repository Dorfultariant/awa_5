const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    name: String,
    instructions: [String],
    ingredients: [String],
    categories: [Schema.Types.ObjectId]
});

module.exports = mongoose.model("Recipe", recipeSchema);
