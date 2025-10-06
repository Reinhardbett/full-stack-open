import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onDelete, handleLike }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      onDelete(blog.id)
    }
  }

  // Check if logged-in user is the creator of the blog
  const isOwner = blog.user && user && blog.user.username === user.username

  return (
    <div style={blogStyle}>
      {!visible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(true)}>view</button>
        </div>
      )}
      {visible && (
        <div>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setVisible(false)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            likes { blog.likes }
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{user.username}</div>
          {isOwner && (
            <button onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog