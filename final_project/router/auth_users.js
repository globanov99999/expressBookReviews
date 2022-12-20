const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    existed_users = users.filter((user) => user.username === username);
    if (existed_users.length === 0) {
        return false
    }
    return true
}

const authenticatedUser = (username, password) => {
    auth_users = users.filter((user) => (user.username === username) && (user.password === password));
    if (auth_users.length === 0) {
        return false
    }
    return true
}

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(404).json({message: "username Empty"});
    }
    if (!password) {
        return res.status(404).json({message: "password Empty"});
    }
    if (!isValid(username)) {
        return res.status(404).json({message: "username not exited"});
    }
    if (!authenticatedUser(username, password)) {
        return res.status(404).json({message: "password is incorrect"});
    }

    let accessToken = jwt.sign({
        data: req.body
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken
    }
    req.session.username = username
    return res.status(200).send("User successfully logged in");
});


regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const review = req.body.review;
    const isbn = req.params.isbn;
    books[isbn].reviews[username] = review
    res.send("Review posted!")
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const isbn = req.params.isbn;
    let map = new Map(Object.entries(books[isbn].reviews));
    if (map.size && map.has(username)) {
        map.delete(username)
        books[isbn].reviews = map
        res.send("Review removed!")
    } else {
        res.send("No review to remove!")
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
