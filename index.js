const express = require ('express');
const app = express();
const port = 3001;

app.use(express.json())

const phonebooks = require("./data/phonebook.json");

app.get("/api/persons", (request, response) => {
    return response.json(phonebooks);
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = phonebooks.find(pers => pers.id === id);

    if (person === undefined) {
        return response.status(404).end();
    }

    return response.json(person);
});

app.get("/info", (request, response) => {
    const peopleCount = phonebooks.length;
    return response.send(`Phonebook has info for ${peopleCount} people<br>${Date()}`);
})

app.listen(port, () => {
    console.log("Connected!");
})

