# 📞 Phonebook Backend API

This is a simple RESTful API built with **Node.js** and **Express**. It simulates a phonebook application with basic CRUD functionality, request logging, timestamp tracking, and data validation.

---

## 🚀 Features Implemented

### 1. **Express Server Setup**
- The app is initialized using the Express framework.
- Listens on port **3001**.

```js
const express = require('express');
const app = express();
```

---

### 2. **Middleware**

#### a. `express.json()`
- Parses incoming JSON requests.

#### b. **Custom Middleware for Request Time**
- Stores the request timestamp used for the `/info` route.

#### c. **Morgan Logging**
- Logs HTTP request details.
- Includes a **custom token** that logs the body of POST requests.

```js
const morgan = require('morgan');

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
```

## 3. 🧱 **Models in Mongoose**

Models are constructor functions that create new JavaScript objects based on a defined schema. These objects include all the properties and methods specified in the schema, including methods to interact with the database.

### Saving an object

To save a new object to the database, use the `save` method, which returns a promise:

```js
Person.save().then(result => {
  console.log('person saved!');
  mongoose.connection.close();
});
```

### Retrieving objects

To retrieve all documents from the collection, use the find method with an empty object as the search criteria:

```js
Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person);
  });
  mongoose.connection.close();
});
```

### Deleting an object

You can delete an object using Mongoose's findByIdAndDelete method:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});
```

## 4. 🔧 Formatting JSON Output

By default, Mongoose includes fields like _id and __v that aren't always useful for frontend applications. To clean up the returned JSON, you can override the toJSON method in the schema:

```js
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
```
## 5. 🔍 Validation and ESLint

One can validate the format of the data before it is stored using the validation functionality available in Mongoose.

The minLength and required validators are some of the built-in validators provided by Mongoose. 

The Mongoose custom validator functionality allows us to create new validators if none of the built-in ones cover our needs.

```javascript
const userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});
```


Custom validators will often use [regex](https://www.rexegg.com/regex-quickstart.php) functions to define our constraints. 


---

## 🧠 Concepts Practiced

- Setting up an Express server
- Creating RESTful routes (GET, POST, DELETE)
- Using middleware: `express.json()` for parsing JSON
- Custom middleware for tracking request timestamps
- Using `morgan` for logging HTTP requests with a custom token
- Responding with appropriate HTTP status codes: `200`, `201`, `204`, `400`, `404`
- Filtering and finding objects within an array
- Data validation for POST requests
- Returning custom error messages for invalid or duplicate inputs
- Avoiding multiple responses using `return` before `res` calls in conditional branches
- Managing in-memory data updates properly (especially in DELETE route)
- Formatting HTML responses with line breaks using `<br>`
- Define and use Mongoose models
- Save and fetch data from MongoDB
- Format returned JSON for frontend use
- Centralize error handling with middleware
- Perform CRUD operations via RESTful routes
- Validation and ESLint
- Running the linter
- Adding more rules and styles to the lint configuration files

---

## ⚠️ Error Handling and Status Codes

- `400 Bad Request`: If name or number is missing or not unique.
- `404 Not Found`: If person is not found during lookup by ID.
- `204 No Content`: On successful deletion of a contact.

---

## 🛠 How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node index.js
   ```

3. API will be accessible at:
   ```
   http://localhost:3001
   ```

---

Made with ❤️ during the Full Stack Open course.