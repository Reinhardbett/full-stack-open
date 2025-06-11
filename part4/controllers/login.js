// const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
// const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    if (!(username && password)) {
        return response.status(400).json({
            error: 'please input username and password'
        })
    } else if (username.length < 4 || password.length < 4) {
        return response.status(400).json({
            error: 'please ensure inputs are more than 3 characters long'
        })
    }

    response
        .status(200)
        .send({username: username, password: password})
})

module.exports = loginRouter