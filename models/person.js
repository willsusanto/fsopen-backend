const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const dbUrl = process.env.MONGODB_URI
console.log('Connecting to MongoDB!')
mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to MongoDB!')
  })
  .catch(error => {
    console.error('ERROR: Failed to connect!', error)
  })

const personSchemaOption = {
  toJSON: {
    transform: function (document, returnedObject) {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  }
}
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (value) {
        const phoneRegex = /^(\d{2,3})-(\d+)$/
        return phoneRegex.test(value)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
}, personSchemaOption)

const Person = mongoose.model('Person', personSchema)

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

module.exports = { Person, isValidObjectId }