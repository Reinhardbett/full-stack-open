const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

// Initialise the database

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        // Test GET requests to api/blogs URL
        .get('/api/blogs')
        .expect(200)
        // Test that they are in JSON format
        .expect('Content-Type', /application\/json/)
})

// Verify the correct number of blog posts are returned
test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// Verify that the unique identifier is named id and not _id
test('blogs are returned with string identifier', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.ok(blog.id, "Blog is missing id property")
        assert.strictEqual(typeof blog.id, 'string', 'id is not a string')
        assert.strictEqual(blog._id, undefined, 'Blog should not have _id property')
    })
})

// Verify that post request returns the correct number of blogs
test('a valid blog can be added', async () => {
    const newBlog = {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    
    const blogsAfterOp = await helper.blogsInDb()
    assert.strictEqual(blogsAfterOp.length, helper.initialBlogs.length + 1)

    const titles = blogsAfterOp.map(t => t.title)    
    assert(titles.includes('Type wars'))
})

// Verify that the  likes property defaults to 0
test('the likes property defaults to zero', async () => {
    const newBlog = {
        _id: '5a422bc61b54a676234d17fc',
        title: 'New wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewWars.html',
        __v: 0
    }

    await api 
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAfterOp = await helper.blogsInDb()
    const addedBlog = blogsAfterOp.find(blog => blog.title === 'New wars')
    assert.ok(addedBlog, 'Blog with title "New wars" was not found')
    assert.strictEqual(addedBlog.likes, 0, 'Likes property is not 0')
})

// Verify that blogs without titles cannot be added
test('a blog without title cannot be added', async () => {
    const newBlog = {
        _id: '5a422bc61b54a676234d17fc',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewWars.html',
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const blogsAfterOp = await helper.blogsInDb()
    assert.strictEqual(blogsAfterOp.length, helper.initialBlogs.length)
})

after(async () => {
    mongoose.connection.close()
})
