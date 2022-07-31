const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./model/user')
const Bookmark = require('./model/bookmarks')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const XMLHttpRequest = require("xhr2")
const crypto = require('crypto');
const { response } = require('express')
const { abort } = require('process')
const { syncBuiltinESMExports } = require('module')
const JWT_SECRET = 'J;LKFDA;LKJfjA*$@!yWkujop*@$&(*&$*(&ikasdf*&ewjdsu_!$*(&_!_(rAFKJLKL'
let hash = ""
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
        const user = jwt.decode(token, JWT_SECRET)
        console.log(user.email)
        return res.json({ status: 'okay', email: user.email })

    })
    // sends a get request to the specified url and returns the response using callback function 
function httpGetAsync(theUrl, callback) {

    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.onreadystatechange = function() {
        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200)
            callback(xmlHttpReq.responseText);
    }
    xmlHttpReq.open("GET", theUrl, true); // true for asynchronous  
    xmlHttpReq.send(null);
}

// generates the hash of the given string 
function makeHash(pageContent) {
    let hash = crypto.createHash('sha512')
    let hashVal = hash.update(pageContent, 'utf-8').digest('base64')
    return hashVal
}

// calls the httpGetAsync function and passes the callback function as the second argument 
// the callback function is called when the response is ready 
// inside the callback function the response is parsed and the hash is made 
// httpGetAsync('https://www.fisat.ac.in', function(result) {
//     hash = makeHash(result);
//     console.log("WEBPAGE HASH:" + hash);
// });
app.post('/api/saveBookmark', async(req, res) => {
    const name = req.body.siteName
    const url = req.body.siteUrl
    const email = req.body.email
    hash = 'deafult'
    httpGetAsync('https://www.' + url, function(result) {
        hash = makeHash(result);
        console.log("WEBPAGE HASH:" + hash);

        const bookmarks = new Bookmark({ email: email, siteName: name, siteUrl: url, siteContent: hash })
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
    });
})
app.post('/api/fetchBookmark', async(req, res) => {
    const email = req.body.email
    const bookmarks = await Bookmark.find({ email: email }).lean()
    if (!bookmarks) {
        //if no bookmark is found
        return res.json({ status: 'empty' })
    }
    return res.json({ bookmark: bookmarks })
})
app.post('/api/fetchUpdates', async(req, res) => {

    const email = req.body.email
    const bookmarks = await Bookmark.find({ email: email }).lean()
    if (!bookmarks) {
        //if no bookmark is found
        return res.json({ status: 'empty' })
    }
    var len = bookmarks.length
    for (var i = 0; i < len; i++) {
        var name = bookmarks[i].siteName;
        var url = bookmarks[i].siteUrl;

        httpGetAsync('https://www.' + url, function(result) {
            hash = makeHash(result);
            console.log(url + "WEBPAGE HASH:" + hash);
            var content = bookmarks[i].siteContent;
            if (hash == content) {
                bookmarks.splice(i, 1)
                i--
                len--
            }

        });
        await sleep(2000)
    }
    console.log(bookmarks)
    return res.json({ bookmark: bookmarks })
})
app.post('/api/deleteBookmark', async(req, res) => {

    const email = req.body.email
    const siteUrl = req.body.siteUrl
    const siteName = req.body.siteName
    await Bookmark.deleteOne({ email: email, siteName: siteName, siteUrl: siteUrl })
        .then(data => {
            res.json({ status: 'Deleted' })
        }).catch(err => {
            console.log(err)
        })
})

app.listen(9999, () => {
    console.log('Server up at http://localhost:9999')
})