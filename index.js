const express = require ('express');
const app = express();
const port = 3001;

app.use(express.json())

let phonebooks = require("./data/phonebook.json");

const generateNewId = () => {
    const maxValue = 100000000;
    return Math.floor(Math.random() * maxValue);
}

const isNullOrWhitespace = (input) => {
    return input === null || input === undefined || input === "" || input.trim() === "";
}

app.get("/api/persons", (request, response) => {
    return response.json(phonebooks);
})

app.post("/api/persons", (request, response) => {
    if (isNullOrWhitespace(request.name)) {
        return response.status(400).end();
    }

    if (isNullOrWhitespace(request.number)) {
        return response.status(400).end();
    }

    const newData = {
        id: generateNewId(),
        name: request.name,
        number: request.number
    };
    phonebooks = [...phonebooks, newData]
    
    return response.status(201).json(newData);
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = phonebooks.find(pers => pers.id === id);

    if (person === undefined) {
        return response.status(404).end();
    }

    return response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    phonebooks = phonebooks.filter(person => person.id !== id);

    return response.status(204).end();
})

app.get("/info", (request, response) => {
    const peopleCount = phonebooks.length;
    return response.send(`Phonebook has info for ${peopleCount} people<br>${Date()}`);
})


app.listen(port, () => {
    console.log("Connected!");
})

