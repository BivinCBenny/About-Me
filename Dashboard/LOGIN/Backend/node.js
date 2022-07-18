const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./model/user')
const Bookmark = require('./model/bookmarks')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { response } = require('express')
const { abort } = require('process')
const JWT_SECRET = 'J;LKFDA;LKJfjA*$@!yWkujop*@$&(*&$*(&ikasdf*&ewjdsu_!$*(&_!_(rAFKJLKL'

const mongodbconn = async function(mongoose) {
    await mongoose.connect('mongodb+srv://bivin:bivin@cluster0.0nvervm.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("SUCCESS DATABASE")).catch(err => { throw err })
}
mongodbconn(mongoose)
const app = express()
app.use(cors())
    // app.use('/', express.static(path.join(__dirname, 'Frontend')))
app.use(express.json())
    // fs.readFile('./Frontend/index.html', (req, res) => {
    //     console.log("hi")
    //     res.send("hi")
    // })
app.post('/api/register', async(req, res) => {
    const name = req.body.username
    const pass = req.body.password
    const email = req.body.email
    const encypted_pass = await bcrypt.hash(pass, 9)

    const users = new User({ email: email, username: name, password: encypted_pass })
    users.save().then(data => {
        res.json({ status: 'Saved' })
    }).catch(err => {
        console.log(err)
        if (err.code === 11000) { //duplicate key error

            if (typeof(err.keyPattern.username) != "undefined") { //checks if duplicate key is username
                return res.json({ status: 'error', error: 'username already in use' })
            }
            return res.json({ status: 'error', error: 'email already in use' })
        }
        throw err
    })


})
app.post('/api/login', async(req, res) => {

    const name = req.body.username;
    const pass = req.body.password;
    const user = await User.findOne({ $or: [{ username: name }, { email: name }] }).lean()
    if (!user) {
        //if no user is found
        return res.json({ status: 'error', error: 'Invalid Username/Password' })
    }
    if (await bcrypt.compare(pass, user.password)) {
        //username password combination is successful
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email
        }, JWT_SECRET)
        return res.json({ status: 'success', data: token })
    } else {
        return res.json({ status: 'error', error: 'Invalid Username/Password' })
    }

})
app.post('/api/mail_return', async(req, res) => {
    const token = req.body.token
    console.log(token)
    const user = jwt.decode(token, JWT_SECRET)
    console.log(user.email)
    return res.json({ status: 'okay', email: user.email })

})
app.post('/api/saveBookmark', async(req, res) => {
    const name = req.body.siteName
    const url = req.body.siteUrl
    const email = req.body.email

    const bookmarks = new Bookmark({ email: email, siteName: name, siteUrl: url })
    bookmarks.save().then(data => {
        res.json({ status: 'Saved' })
    }).catch(err => {
        console.log(err)
        if (err.code === 11000) { //duplicate key error

            if (typeof(err.keyPattern.username) != "undefined") { //checks if duplicate key is username
                return res.json({ status: 'error', error: 'username already in use' })
            }
            return res.json({ status: 'error', error: 'email already in use' })
        }
        throw err
    })


})
app.post('/api/fetchBookmark', async(req, res) => {

    const email = req.body.email
    const bookmarks = await Bookmark.find({ email: email }).lean()
    if (!bookmarks) {
        //if no bookmark is found
        return res.json({ status: 'empty' })
    }
    console.log(bookmarks)
    return res.json({ bookmark: bookmarks })
})

app.listen(9999, () => {
    console.log('Server up at http://localhost:9999')
})