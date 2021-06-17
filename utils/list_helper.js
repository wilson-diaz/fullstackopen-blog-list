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

  //const maxLikes = Math.max(...blogs.map(x => x.likes))
  return _.maxBy(blogs, 'likes') //blogs.find(x => x.likes === maxLikes)
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

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) { return null }
  else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes
    }
  }

  // add up likes per author
  const authorsToLikes = blogs.reduce((temp, blog) => {
    if (!temp) { return temp }
    if (Object.prototype.hasOwnProperty.call(temp, blog.author)) {
      temp[blog.author] += blog.likes
    } else {
      temp[blog.author] = blog.likes
    }
    return temp
  }, {})

  const retobj = { author: '', likes: 0 }
  Object.entries(authorsToLikes)
    .forEach(([key, value]) => {
      if (value > retobj.likes) {
        retobj.author = key
        retobj.likes = value
      }
    })
  return retobj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}