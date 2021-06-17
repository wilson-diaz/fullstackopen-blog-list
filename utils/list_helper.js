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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}