const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed
  name: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password // should not be revealed
  }
})

module.exports = mongoose.model('User', userSchema)
