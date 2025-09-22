import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: likes + 1 }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setLikes(returnedBlog.likes)
  }

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
          <div>{blog.title}</div>
          <div>{blog.url}</div>
          <div>
            likes { likes }
            <button onClick={handleLike}>like</button>
          </div>
          <div>{user.username}</div>
          <button onClick={() => setVisible(false)}>hide</button>
        </div>
      )}
    </div>
  )
}

export default Blog