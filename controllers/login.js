const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({ username: request.body.username })
  const isPasswordCorrect = user === null
    ? false
    : await bcrypt.compare(request.body.password, user.password)

  if (!(user && isPasswordCorrect)) {
    let err = new Error('invalid username or password')
    err.name = 'LoginError'
    throw err
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter