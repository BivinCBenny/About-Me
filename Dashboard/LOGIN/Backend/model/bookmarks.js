const mongoose = require('mongoose')

const BookmarkSchema = new mongoose.Schema({
    email: { type: String, required: true },
    siteName: { type: String, required: true },
    siteUrl: { type: String, required: true }
}, { collection: 'bookmarks' })
const model_bookmarks = mongoose.model('BookmarkSchema', BookmarkSchema)
module.exports = model_bookmarks