const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // default missing likes to 0
  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title && !request.body.url) {
    let err = new Error('missing blog title and url')
    err.name = 'ValidationError'
    throw err
  }

  const user = await User.findById(request.body.user)

  const blog = new Blog(request.body)
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
