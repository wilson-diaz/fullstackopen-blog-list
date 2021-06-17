const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  if (!blogs || blogs.length === 0) { return 0 }
  else if (blogs.length === 1) { return blogs[0].likes }

  // more than one blog
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) { return null }
  else if (blogs.length === 1) { return blogs[0] }

  const maxLikes = Math.max(...blogs.map(x => x.likes))
  return blogs.find(x => x.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) { return null }
  else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1
    }
  }

  const authorsToBlogs = _.countBy(blogs, 'author')
  const retobj = { author: '', blogs: 0 }
  Object.entries(authorsToBlogs)
    .forEach(([key, value]) => {
      if (value > retobj.blogs) {
        retobj.author = key
        retobj.blogs = value
      }
    })
  return retobj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}