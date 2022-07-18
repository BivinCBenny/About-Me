// Listen for form submit
let myForm = document.getElementById('myForm')
if (myForm) {

    myForm.addEventListener('submit', saveBookmark);
}

// Save Bookmark
async function saveBookmark(e) {
    // Get form values

    var siteName = document.getElementById('siteName').value;
    var siteUrl = document.getElementById('siteUrl').value;

    if (!validateForm(siteName, siteUrl)) {
        console.log("INVALID FORM")
        return false;
    }

    // var bookmark = {
    //     name: siteName,
    //     url: siteUrl
    // }

    /*
      // Local Storage Test
      localStorage.setItem('test', 'Hello World');
      console.log(localStorage.getItem('test'));
      localStorage.removeItem('test');
      console.log(localStorage.getItem('test'));
    */
    const email = localStorage.getItem('email');
    console.log("email:" + email)
        // Perform your AJAX/Fetch login
    const result = await fetch('http://localhost:9999/api/saveBookmark', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            siteName,
            siteUrl

        })
    }).then((res) => res.json()).catch(err => { console.log(err) })
    console.log(result)
    if (result.status === 'Saved') {
        //everything went fine
    } else {}

    // Test if bookmarks is null
    // if (localStorage.getItem('bookmarks') === null) {
    //     // Init array
    //     var bookmarks = [];
    //     // Add to array
    //     bookmarks.push(bookmark);
    //     // Set to localStorage
    //     localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    // } else {
    //     // Get bookmarks from localStorage
    //     var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    //     // Add bookmark to array
    //     bookmarks.push(bookmark);
    //     // Re-set back to localStorage
    //     localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    // }

    // Clear form
    document.getElementById('myForm').reset();

    // Re-fetch bookmarks
    fetchBookmarks();

    // Prevent form from submitting

}

// Delete bookmark
function deleteBookmark(url) {
    // Get bookmarks from localStorage
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    // Loop through the bookmarks
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].url == url) {
            // Remove from array
            bookmarks.splice(i, 1);
        }
    }
    // Re-set back to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Re-fetch bookmarks
    fetchBookmarks();
}

// Fetch bookmarks
async function fetchBookmarks() {
    // Get bookmarks from localStorage
    //var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    // Get output id
    var bookmarksResults = document.getElementById('bookmarksResults');
    //var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const email = localStorage.getItem('email')
    const result = await fetch('http://localhost:9999/api/fetchBookmark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        }).then((res) => res.json()).catch(err => { console.log(err) })
        // if (result.status === 'Success') {
        //     //everything went fine
        // } else {}
        // Build output

    console.log(result)
    var bookmarks = result.bookmark
    console.log("hey" + bookmarks)
    bookmarksResults.innerHTML = '';
    for (var i = 0; i < bookmarks.length; i++) {
        var name = bookmarks[i].siteName;
        var url = bookmarks[i].siteUrl;

        bookmarksResults.innerHTML += '<div class="well">' +
            '<h3>' + name +
            ' <a class="btn btn-default" target="_blank" href="' + addhttp(url) + '">Visit</a> ' +
            ' <a onclick="deleteBookmark(\'' + url + '\')" class="btn btn-danger" href="#">Delete</a> ' +
            '</h3>' +
            '</div>';
    }
};

// Validate Form
function validateForm(siteName, siteUrl) {
    if (!siteName || !siteUrl) {
        alert('Please fill in the form');
        return false;
    }

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    if (!siteUrl.match(regex)) {
        alert('Please use a valid URL');
        return false;
    }

    return true;
}

function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}
document.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()
    console.log("DOM LOADED")
    const result = await fetch('http://localhost:9999/api/mail_return', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('token')

        })
    }).then(res => {
        res.json()

    }).catch((err) => { console.log("error:" + err) })
    console.log("RESPONSE:" + result)
    let element = document.getElementById("username")
    if (element) {

        element.textContent = 'email'
    }
});