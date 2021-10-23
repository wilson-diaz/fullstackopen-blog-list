const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 }).populate('comments', { blog: 0 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // authenticate user
  if (!(request.token && request.user.id)) {
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
  const user = await User.findById(request.user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user._id
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const toDelete = await Blog.findById(request.params.id)
  if (toDelete.user.toString() !== request.user.id.toString()) {
    let err = new Error('wrong user')
    err.name = 'AuthenticationError'
    throw err
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
  response.json(result)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  // authenticate user
  if (!(request.token && request.user.id)) {
    let err = new Error('token missing or invalid')
    err.name = 'AuthenticationError'
    throw err
  }

  const body = request.body

  // validation
  if (!body.content) {
    let err = new Error('missing content or blog id')
    err.name = 'ValidationError'
    throw err
  }

  const blog = await Blog.findById(request.params.id)

  const comment = new Comment({
    content: body.content,
    blog: blog._id
  })
  const savedComment = await comment.save()

  // update blog document
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = blogsRouter
