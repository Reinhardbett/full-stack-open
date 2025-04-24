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

## 📦 Dependencies

- [express](https://www.npmjs.com/package/express)
- [morgan](https://www.npmjs.com/package/morgan)

---

## 📁 Project Structure

```
├── index.js        # Main application file
├── package.json
└── README.md       # You're here!
```

---

Made with ❤️ during the Full Stack Open course.

