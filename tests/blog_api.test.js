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

describe('viewing initial blogs saved', () => {
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
})

describe('adding a new blog', () => {
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
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    // check data
    delete response.body.id
    expect(response.body).toEqual(newBlog)
  })

  test('missing likes default to 0', async () => {
    const newBlog = {
      title: 'thisisatestblog',
      author: 'Test Author',
      url: 'https://myurl.test',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // check likes
    expect(response.body.likes).toBe(0)
  })

  test('missing title and url cause error', async () => {
    const newBlog = {
      author: 'Test Author',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    // check that it wasn't added
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting blogs', () => {
  test('deleting a single blog', async () => {
    const toDelete = '5a422b891b54a676234d17fa'
    await api
      .delete(`/api/blogs/${toDelete}`)
      .expect(204)

    // check that it does not exist in DB
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd.some(blog => blog.id === toDelete)).toBe(false)
  })
})

describe('updating blogs', () => {
  test('updating an individual blog', async () => {
    const toUpdate = '5a422ba71b54a676234d17fb'
    const updatedBlog = {
      likes: 10
    }

    await api
      .put(`/api/blogs/${toUpdate}`)
      .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd.find(blog => blog.id === toUpdate).likes).toBe(updatedBlog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})