const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // authenticate user
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!(request.token && decodedToken.id)) {
    let err = new Error('token missing or invalid')
    err.name = 'AuthenticationError'
    throw err
  }

  const body = request.body
  // default missing likes to 0
  if (!body.likes) {
    body.likes = 0
  }

  // validation
  if (!body.title && !body.url) {
    let err = new Error('missing blog title and url')
    err.name = 'ValidationError'
    throw err
  }

  // find user using id from auth token
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user._id
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
  response.json(result)
})

module.exports = blogsRouter
