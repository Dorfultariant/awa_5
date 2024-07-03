
// Lists for storing temp data:
let listOfInstructions = [];
let listOfIngredients = [];


document.addEventListener("DOMContentLoaded", async () => {

    // Populate index.html with default stuff
    sendData("get", "Pizza");

    const recName = document.getElementById("name-text");

    const ingredientTextArea = document.getElementById("ingredients-text");
    const addIngredientBtn = document.getElementById("add-ingredient");

    const instructionTextArea = document.getElementById("instructions-text");
    const addInstructionBtn = document.getElementById("add-instruction");

    const imgInput = document.getElementById("image-input");

    const submitBtn = document.getElementById("submit");



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
        sendData("post", recName.value);
        sendImgData(imgData);

        // Clear temp lists
        listOfIngredients = [];
        listOfInstructions = [];
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

async function sendData(method, foodName) {
    try {
        let res;
        const ingredientList = document.getElementById("list");
        if (method === "get") {
            res = await fetch(`/recipe/${foodName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

        } else if (method === "post") {

            const resBody = JSON.stringify({
                name: foodName,
                instructions: listOfInstructions,
                ingredients: listOfIngredients
            });

            res = await fetch(`/recipe/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: resBody,
            });

        }

        // Data is added to the frontend from response json
        if (res.ok) {
            const data = await res.json();
            console.log(data);

            const recName = document.createElement("h2");
            const instrcution = document.createElement("p");
            const ingredients = document.createElement("p");

            recName.textContent = data.name;
            instrcution.textContent = data.instructions;
            ingredients.textContent = data.ingredients;

            ingredientList.appendChild(recName);
            ingredientList.appendChild(instrcution);
            ingredientList.appendChild(ingredients);
        }

    } catch (error) {
        console.error("Error produced: ", error);
    }
}
