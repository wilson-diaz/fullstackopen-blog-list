const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // default missing likes to 0
  if(!request.body.likes) {
    request.body.likes = 0
  }

  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter
