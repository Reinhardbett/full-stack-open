const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

let token

// Initialise the database
beforeEach(async () => {
  await Blog.deleteMany({})

  const newUser = {
    username: 'test',
    name: 'testUser',
    password: 'testpassword'
  }
  await api.post('/api/users')
    .send(newUser)

  // Retrieve a test token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })

  token = loginResponse.body.token

  await Blog.insertMany(helper.initialBlogs)
})

describe('when creating a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .catch(err => console.log(err.response.body))


    const blogsAfterOp = await helper.blogsInDb()
    assert.strictEqual(blogsAfterOp.length, helper.initialBlogs.length + 1)

    const titles = blogsAfterOp.map(t => t.title)
    assert(titles.includes('Type wars'))
  })

  // Verify that the  likes property defaults to 0
  test('the likes property defaults to zero', async () => {
    const newBlog = {
      title: 'New wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewWars.html'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOp = await helper.blogsInDb()
    const addedBlog = blogsAfterOp.find(blog => blog.title === 'New wars')
    assert.ok(addedBlog, 'Blog with title "New wars" was not found')
    assert.strictEqual(addedBlog.likes, 0, 'Likes property is not 0')
  })

  // Verify that blogs without titles cannot be added
  test('a blog without a title cannot be added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewWars.html'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAfterOp = await helper.blogsInDb()
    assert.strictEqual(blogsAfterOp.length, helper.initialBlogs.length)
  })

  test('a blog cannot be added when no token is provided', async() => {
    const newBlog = {
      title: 'We are the new AI',
      author: 'Robert Greene',
      url: 'http://blog.cleanme.com/newwaystodie.html'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401) // http status code unauthorised

    const blogsAfterOp = await helper.blogsInDb()
    assert.strictEqual(blogsAfterOp.length, helper.initialBlogs.length)
  })
})

describe('when retrieving blogs from the database', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // Verify that the unique identifier is named id and not _id
  test('blogs are returned with correct string identifier', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id, 'Blog is missing id property')
      assert.strictEqual(typeof blog.id, 'string', 'id is not a string')
      assert.strictEqual(blog._id, undefined, 'Blog should not have _id property')
    })
  })
})

describe('when updating blogs in the database', () => {
  test('updating the number of likes works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedLikes = blogToUpdate.likes + 10

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedLikes, 'Likes property was not updated')

    // Optionally, check the DB as well
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, updatedLikes, 'Likes property in DB was not updated')
  })
})

describe('when deleting blogs in the database', () => {
  test('succeeds with status 204 if id is valid', async () => {
    // Create blog via API to retrieve correct user
    const newBlog = {
      title: 'Blog to delete',
      author: 'Author254',
      url: 'http://mightdeletelater.com'
    }

    const createResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = createResponse.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfterOp = await helper.blogsInDb()
    const titles = blogsAfterOp.map(t => t.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

after(async () => {
  mongoose.connection.close()
})
