import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import ToggleForm from './components/ToggleForm'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
    
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 2000)
  }
  
  const handleCreateBlog = async (blogObject) => {
    try { 
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`, 'success')
    } catch (error) {
      showNotification('Failed to add blog. Please check your input or authentication.', 'error')
    }
  }

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}!`, 'success')
    } catch {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    window.localStorage.clear()
    setUser(null)
    showNotification('Logged out successfully.', 'success')
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
          <ToggleForm buttonLabel="Log in to application">
            <LoginForm
              handleLogin={handleLogin}
            />
          </ToggleForm>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button type="submit" onClick={handleLogout}>logout</button>
          <ToggleForm buttonLabel="Create new blog">
            <BlogForm 
              user={user}
              handleCreateBlog={handleCreateBlog}
            />
          </ToggleForm>
        </div>
      )}
      {blogs
        .slice() // create a shallow copy to avoid mutating state
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user} />
        )
      }
    </div>
  )
}

export default App