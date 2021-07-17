const mongoose = require('mongoose')
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const toSave = helper.initialBlogs.map(blog => new Blog(blog))
  const promises = toSave.map(obj => obj.save())
  await Promise.all(promises)
})

test('all blogs returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('blogs have unique identifier named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body[0].id).toBeDefined()
})

test('post is successful', async () => {
  const newBlog = {
    title: 'thisisatestblog',
    author: 'Test Author',
    url: 'https://myurl.test',
    likes: 3
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // check if stored in DB
  const notesAtEnd = await helper.blogsInDB()
  expect(notesAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  // check data
  delete response.body.id
  expect(response.body).toEqual(newBlog)
})

afterAll(() => {
  mongoose.connection.close()
})