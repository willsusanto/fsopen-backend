const express = require ('express');
const app = express();
const port = 3001;

app.use(express.json())

const phonebooks = require("./data/phonebook.json");

app.get("/api/persons", (request, response) => {
    return response.json(phonebooks);
})

app.listen(port, () => {
    console.log("Connected!");
})

