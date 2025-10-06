import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom' // for toBeInTheDocument
import userEvent from '@testing-library/user-event' // for simulating user inputs
import Blog from './Blog'

test('renders title and author', async () => {
    const blog = {
        title: 'myTestTitle',
        author: 'myTestAuthor',
        url: 'http://myTestTitle.com'
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={{ username: 'testuser' }} handleLike={mockHandler} />)
    
    // Title and author are rendered
    expect(screen.getByText(/myTestTitle/)).toBeInTheDocument()
    expect(screen.getByText(/myTestAuthor/)).toBeInTheDocument()

    // but not URL
    expect(screen.queryByText('http://myTestTitle.com')).not.toBeInTheDocument()

    // Url and number of likes are shown when view button is clicked
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('http://myTestTitle.com')).toBeInTheDocument()
    expect(screen.getByText('likes')).toBeInTheDocument()

    // Clicking the like button twice calls handleLike twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)    
})
