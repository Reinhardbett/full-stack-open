const { test, after, beforeEach, describe } = require('node:test')
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

describe('when creating a new blog', () => {
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
    test('a blog without a title cannot be added', async () => {
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
            assert.ok(blog.id, "Blog is missing id property")
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
        const blogsBeforeOp = await helper.blogsInDb()
        const blogToDelete = blogsBeforeOp[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAfterOp = await helper.blogsInDb()
        const titles = blogsAfterOp.map(t => t.title)    
        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAfterOp.length, helper.initialBlogs.length - 1)
    })
})

after(async () => {
    mongoose.connection.close()
})
