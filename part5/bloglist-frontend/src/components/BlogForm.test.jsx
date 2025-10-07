import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls handleCreateBlog with the right details', async () => {
    const handleCreateBlog = vi.fn()
    render(<BlogForm user={{ username: 'testuser' }} handleCreateBlog={handleCreateBlog} />)

    const user = userEvent.setup()
    
    await user.type(screen.getByLabelText('title:'), 'myTestTitle')
    await user.type(screen.getByLabelText('author:'), 'myTestAuthor')
    await user.type(screen.getByLabelText('url:'), 'myTestUrl')
 
    const createButton = screen.getByText('create')
    await user.click(createButton)

    // Assert that we call handleCreateBlog
    expect(handleCreateBlog).toHaveBeenCalledTimes(1)
    
    // Assert that handleCreateBlog is called with title, author, and url details
    expect(handleCreateBlog).toHaveBeenCalledWith({
        title: 'myTestTitle',
        author: 'myTestAuthor',
        url: 'myTestUrl'
    })
})