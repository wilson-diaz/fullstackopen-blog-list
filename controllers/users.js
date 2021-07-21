const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const hashedPassword = await bcrypt.hash(request.body.password, 10)

  const newUser = new User({
    username: request.body.username,
    name: request.body.name,
    password: hashedPassword
  })

  const result = await newUser.save()
  response.status(201).json(result) // password property is deleted by toJSON
})

module.exports = usersRouter
