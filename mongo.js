require('dotenv').config()

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please input password!')
  process.exit(1)
}

const [, , password, name, number] = process.argv
const dbUrl = `${process.env.MONGODB_URI_1}${password}${process.env.MONGODB_URI_2}`

mongoose.set('strictQuery', false).connect(dbUrl)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (name !== undefined && number !== undefined) {
  const newPerson = new Person({
    name,
    number
  })

  newPerson.save().then(() => {
    console.log(`${name} with number ${number} added to phonebook!`)
    mongoose.connection.close()
  })

  return
}

Person.find({ }).then(people => {
  console.log('--- Phonebook Data ---')
  people.forEach(person => {
    console.log(`${person.name} --- ${person.number}`)
  })
  mongoose.connection.close()
})