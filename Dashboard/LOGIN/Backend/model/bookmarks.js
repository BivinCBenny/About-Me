const mongoose = require('mongoose')

const BookmarkSchema = new mongoose.Schema({
    email: { type: String, required: true },
    bookmark: { type: String, required: true }
}, { collection: 'bookmarks' })
const model_bookmarks = mongoose.model('BookmarkSchema', BookmarkSchema)
module.exports = model_bookmarks