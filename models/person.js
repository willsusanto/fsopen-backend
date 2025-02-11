const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const dbUrl = process.env.MONGODB_URI;
console.log("Connecting to MongoDB!");
mongoose.connect(dbUrl)
    .then(result => {
        console.log("Connected to MongoDB!");
    })
    .catch(error => {
        console.error("ERROR: Failed to connect!", error);
    });

const personSchemaOption = {
    toJSON: {
        transform: function (document, returnedObject) {
            returnedObject.id = returnedObject._id.toString();
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    }
}
const personSchema = new mongoose.Schema({
    name: String,
    number: String
}, personSchemaOption);

const Person = mongoose.model('Person', personSchema);

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = { Person, isValidObjectId }