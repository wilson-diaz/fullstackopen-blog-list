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
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})