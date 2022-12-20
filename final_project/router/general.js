const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.query.username
    if (!username) {
        return res.status(404).json({message: "No username"});
    }
    let password = req.query.password
    if (!password) {
        return res.status(404).json({message: "No password"});
    }
    let existed_users = users.filter((user) => user.username === username);
    if (existed_users.length){
        return res.status(404).json({message: "User already exists"});
    }
    users.push({"username":username,"password":req.query.password});
    res.send("The user" + (' ')+ (req.query.username) + " has been registered!")
});


public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve) => {
        resolve(JSON.stringify({books},null,4))
    })
    myPromise.then((data) => {
        res.send(data);
    })
});


public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve) => {
        let isbn = req.params.isbn;
        let book = books[parseInt(isbn)]
        resolve(book)
    })
    myPromise.then((book) => {
        res.send(book);
    })
 });
  

public_users.get('/author/:author',function (req, res) {
    let myPromise = new Promise((resolve,) => {
        let author = req.params.author;
        let filtered_by_author = Object.values(books).filter((book) => book.author === author);
        resolve(filtered_by_author)
    })
    myPromise.then((filtered_by_author) => {
        res.send(filtered_by_author);
    })
});


public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise((resolve,) => {
        const title = req.params.title;
        let filtered_by_title = Object.values(books).filter((book) => book.title === title);
        resolve(filtered_by_title)
    })
    myPromise.then((filtered_by_title) => {
        res.send(filtered_by_title);
    })
});


public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[parseInt(isbn)]
    let reviews = book.reviews
    res.send(reviews);
});

module.exports.general = public_users;
