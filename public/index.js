
// Lists for storing temp data:
let listOfInstructions = [];
let listOfIngredients = [];
let selected_cats = [];

let cats;

document.addEventListener("DOMContentLoaded", async () => {

    const recName = document.getElementById("name-text");

    const ingredientTextArea = document.getElementById("ingredients-text");
    const addIngredientBtn = document.getElementById("add-ingredient");

    const instructionTextArea = document.getElementById("instructions-text");
    const addInstructionBtn = document.getElementById("add-instruction");

    const imgInput = document.getElementById("image-input");

    const submitBtn = document.getElementById("submit");

    // fetch categories
    getCategories();


    // Add ingredients to a list
    addIngredientBtn.addEventListener("click", async () => {
        listOfIngredients.push(ingredientTextArea.value);
    });

    // Add instructions to a list
    addInstructionBtn.addEventListener("click", async () => {
        listOfInstructions.push(instructionTextArea.value);
    });

    // When recipe is submitted, send to server
    submitBtn.addEventListener("click", async () => {

        // Src: https://stackoverflow.com/questions/25204621/send-image-to-server-using-file-input-type
        // src: https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
        // Src: https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
        const imgData = new FormData();
        const files = imgInput.files;
        for (const f of files) {
            imgData.append("images", f);
        }

        // Send data to server
        sendRecipeData(recName.value);
        //sendImgData(imgData);

        // Clear temp lists
        listOfIngredients = [];
        listOfInstructions = [];
    });

    // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
    const searchField = document.getElementById("search-field");
    searchField.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            sendSearchReq(searchField.value);
        };
    });

});


async function sendImgData(imgData) {
    try {
        const res = await fetch("/images", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: imgData
        });

        if (res.ok) {
            const data = await res.json();
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}

async function sendSearchReq(name) {
    try {
        const res = await fetch(`/api/recipes/recipe/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (res.ok) {
            const data = await res.json();
            createRecipeView(data);
        }
        else {
            console.log("nothing found");
        }
    } catch (err) {
        console.log(err);
    }
}


async function sendRecipeData(name) {
    try {
        const resBody = JSON.stringify({
            name: name,
            instructions: listOfInstructions,
            ingredients: listOfIngredients,
            categories: selected_cats
        });

        const res = await fetch(`/api/recipes/recipe/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: resBody,
        });

        if (res.ok) {
            const data = await res.json();

            createRecipeView(data);
        }

    } catch (error) {
        console.error("Error produced: ", error);
    }
}

async function getCategories() {
    try {
        const res = await fetch("/api/recipes/categories/", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (res.ok) {
            cats = await res.json();

            // display the categories
            createCategoriesView(cats);
        }
    } catch (err) {
        console.log("Error while fetching categories: ", err);
    }
}

function createCategoriesView(data) {
    const categories_ul = document.getElementById("categories");

    cats.forEach((cat) => {
        const li = document.createElement("li");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = cat._id;
        cb.value = cat._id;

        const label = document.createElement("label");
        label.htmlFor = cat._id;
        label.textContent = cat.name;

        li.appendChild(cb);
        li.appendChild(label);
        categories_ul.appendChild(li);
    });

    cbEventListeners();
}

function cbEventListeners() {
    // Fetch all checkboxes
    const cbs = document.querySelectorAll("input[type='checkbox']");

    // Event listeners and toggle
    cbs.forEach((cb) => {
        cb.addEventListener("change", toggleCat);
    });
}

// https://stackoverflow.com/questions/13330202/how-to-create-list-of-checkboxes-dynamically-with-javascript
function toggleCat(event) {
    const cb = event.target;
    if (cb.checked) {
        selected_cats.push(cb.value);
    } else {
        const idx = selected_cats.indexOf(cb.value);
        if (idx !== -1) {
            selected_cats.splice(idx, 1);
        }
    }
}

// Creates the list view for recipes fetched from db
function createRecipeView(data) {
    const recipelist = document.getElementById("list");
    const li = document.createElement("li");
    const name_field = document.createElement("h2");
    const instructions = document.createElement("ul");
    const ingredients = document.createElement("ul");
    const categories = document.createElement("p");

    name_field.textContent = data.name;

    for (const inst of data.instructions) {
        const new_li = document.createElement("li");
        new_li.textContent = inst;
        instructions.appendChild(new_li);
    }

    for (const ingr of data.ingredients) {
        const new_li = document.createElement("li");
        new_li.textContent = ingr;
        ingredients.appendChild(new_li);
    }

    for (const c of data.categories) {
        categories.textContent += `${c} `;
    }

    li.appendChild(name_field);
    li.appendChild(categories);
    li.appendChild(instructions);
    li.appendChild(ingredients);

    recipelist.appendChild(li);
}
