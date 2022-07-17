const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'users' })
const model = mongoose.model('UserSchema', UserSchema)
const BookmarkSchema = new mongoose.Schema({
    email: { type: String, required: true },
    bookmark: { type: String, required: true }
}, { collection: 'bookmarks' })
const model1 = mongoose.model('BookmarkSchema', BookmarkSchema)
module.exports = model
    // module.exports = model1