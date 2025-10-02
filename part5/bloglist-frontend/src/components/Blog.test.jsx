import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom' // for toBeInTheDocument
import Blog from './Blog'

test('renders title and author', () => {
    const blog = {
        title: 'myTestTitle',
        author: 'myTestAuthor',
        url: 'http://myTestTitle.com'
    }

    render(<Blog blog={blog} />)
    
    // Check title and author are rendered
    expect(screen.getByText(/myTestTitle/)).toBeInTheDocument()
    expect(screen.getByText(/myTestAuthor/)).toBeInTheDocument()

    // but not URL
    expect(screen.queryByText('http://myTestTitle.com')).not.toBeInTheDocument()
})
