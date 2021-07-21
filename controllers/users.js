const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { likes: 0, user: 0 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  if (request.body.password.length < 3) {
    let err = new Error('password must be at least 3 characters long')
    err.name = 'ValidationError'
    throw err
  }
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
