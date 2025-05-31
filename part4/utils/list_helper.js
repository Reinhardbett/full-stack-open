const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // Return total number of likes in all blog posts
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return (totalLikes)
}

const favoriteBlog = (blogs) => {
  // Return blog with highest number of likes
  const favoriteBlog = blogs.reduce((fav, blog) => {
    return (blog.likes > fav.likes) ? blog : fav
  }, blogs[0]) // Start with the first blog as the initial favorite
  return (favoriteBlog)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author') // { "Author A": 2, "Author B": 3, ... }

  const authorPairs = _.toPairs(counts) // [ [ 'Author A', 2 ], [ 'Author B', 3 ] ]

  const topAuthor = _.maxBy(authorPairs, ([, blogCount]) => blogCount)

  return {
    author: topAuthor[0],
    blogs: topAuthor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  // Group blogs by author
  const grouped = _.groupBy(blogs, 'author')

  // Create an array of { author, likes } objects
  const likesByAuthor = _.map(grouped, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, 'likes')
  }))

  // Find the author with the most likes
  return _.maxBy(likesByAuthor, 'likes')
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
