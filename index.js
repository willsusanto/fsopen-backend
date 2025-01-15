const express = require ('express');
const app = express();
const port = 3001;

app.use(express.json())

const phonebooks = require("./data/phonebook.json");

app.get("/api/persons", (request, response) => {
    return response.json(phonebooks);
})

app.get("/info", (request, response) => {
    const peopleCount = phonebooks.length;
    return response.send(`Phonebook has info for ${peopleCount} people<br>${Date()}`);
})

app.listen(port, () => {
    console.log("Connected!");
})

