require('dotenv').config()

const express = require ('express')
const morgan = require('morgan')
const cors = require('cors')
const { Person } = require('./models/person')
const app = express()
const port = process.env.PORT || 3001

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const isNullOrWhitespace = (input) => {
  return input === null || input === undefined || input === '' || input.trim() === ''
}

app.get('/api/persons', (_, response) => {
  Person.find({}).exec().then(result => {
    return response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).exec()
    .then(result => {
      if (result === null) {
        return response.status(404).json({
          'messsage': 'Resource not found.'
        })
      }

      response.json(result)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const data = request.body

  if (isNullOrWhitespace(data.name)) {
    return response.status(400).json({
      error: 'Name must be filled!'
    })
  }

  if (isNullOrWhitespace(data.number)) {
    return response.status(400).json({
      error: 'Number must be filled!'
    })
  }

  // if (isNameExist(data.name)) {
  //     return response.status(400).json({
  //         error: "Name already exists!"
  //     });
  // }

  const newData = new Person({
    name: data.name,
    number: data.number
  })

  newData.save()
    .then(result => {
      return response.status(201).json(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true }).exec()
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).exec()
    .then(result => {
      if (result === null) {
        return response.status(404).json({
          'messsage': 'Resource not found.'
        })
      }

      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).exec()
    .then(result => {
      response.send(`Phonebook has info for ${result} people<br>${Date()}`)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (_, response, next) => {
  response.status(404).send({ error: 'Unknown endpoint. ' })
  next()
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('ERROR: ', error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      message: 'Invalid format.'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      message: error.message
    })
  }

  next(error)
}
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Connected on PORT: ${port}!`)
})

