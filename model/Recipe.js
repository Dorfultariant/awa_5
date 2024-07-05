const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    name: String,
    instructions: [String],
    ingredients: [String],
    // https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("Recipe", recipeSchema);
