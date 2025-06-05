# a. Structure of backend application, introduction to testing

For this project, we will adhere to the following project structure:

![best practices node project structure](image.png)

The above project structure helps one abide to [best practices](https://dev.to/nermine-slimane/always-separate-app-and-server-files--1nc7) such as separating API declaration and network-related configurations.

## controllers/notes.js
This will handle all the route events

```javascript
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//...

module.exports = notesRouter
```

## models/note.js
This will define the mongoose schema for note objects.

```javascript
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

## utils/logger.js
This will handle all console.log and console.error functionality.

```javascript
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }
```

## utils/config.js
This will handle all environment variables.

```javascript
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }
```
## utils/middleware.js
This will define our custom middleware

```javascript
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

## App.js
This defines the application

```javascript
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

## Index.js
This starts the application

```javascript
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

# b. Testing the backend

The kind of testing where multiple components of a system are tested is called Integration testing.

## Test environment

It is common practice to define different modes for production, development, and testing.

```javascript
{
  // ...
  "scripts": {

    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development node --watch index.js",
    "test": "NODE_ENV=test node --test",
    "lint": "eslint ."
  }
  // ...
}
```
However, our script will not work on Windows. To achieve cross-platform compatibility, we must use the `cross-env` npm package.

```npm install cross-env```

Thus

```javascript
{
  // ...
  "scripts": {

    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env  NODE_ENV=test node --test",
    "lint": "eslint ."
  },
  // ...
}
```

We can use these modes to specify a different database instance when in testing mode. We can achieve different database instances using mongoDB Atlas, docker containers, or mongdb-in-memory.

```javascript
require('dotenv').config()

const PORT = process.env.PORT


const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

The `.env` file will thus have different addresses for the different test databases.

```javascript
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001


TEST_MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0
```

We will also find that the middleware that outputs information about the HTTP requests is obstructing the test execution output. We can solve this by limiting access for test mode: 

```javascript
const info = (...params) => {

  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {

  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}
```

## Running test commands one by one

Running `npm test` will run all the tests for the application. It may be wise to run only one test at a time.

We can use the `only` method where tests will be run with the --test-only option i.e. `npm test -- --test-only`

```javascript
test.only('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})
```

Here only the `only` marked tests will be run.
The danger is that one may forget to remove the `only` markings later on after testing.

We can also specify tests that need to be run by specifying them as arguments in the `npm test` command.

The following command only runs the tests found in the tests/note_api.test.js file:

`npm test -- tests/note_api.test.js`

The --tests-by-name-pattern option can be used for running tests with a specific name:

`npm test -- --test-name-pattern="a specific note is within the returned notes"`

The provided argument can refer to the name of the test or the describe block. It can also contain just a part of the name. The following command will run all of the tests that contain notes in their name:

`npm run test -- --test-name-pattern="notes"`

## Async/await

The `async` and `await` keywords introduced in ES7 bring the same functionality as the generators in ES6, but in an understandable and syntactically cleaner way to the hands of all citizens of the JavaScript world.

From: 

```javascript
Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

To: 

```javascript
const notes = await Note.find({})
const response = await notes[0].deleteOne()

console.log('the first note is removed')
```

Using `await` is only possible inside an async function. Therefore:

```javascript
const main = async () => {
  const notes = await Note.find({})
  const response = await notes[0].deleteOne()

  console.log('the first note is removed')
}

main()
```
We can now refactor our route handlers using the syntatic magic shown above: 

```javascript
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

We will handle exceptions such as those from promise rejections using try/catch blocks: 

```javascript
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

However, we can refactor our route handlers to avoid the repititive try/catch blocks by importing the `express-async-errors`
The above route handler will become:

```javascript
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

# c. User Administration

# d. Token authentication

---

Made with ❤️ during the Full Stack Open course.

