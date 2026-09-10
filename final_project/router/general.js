const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = async (url = "http://localhost:5000/") => {
  const response = await axios.get(url);
  return response.data;
};

const getBookByISBN = async (isbn, baseUrl = "http://localhost:5000") => {
  const response = await axios.get(`${baseUrl}/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
};

const getBooksByAuthor = async (author, baseUrl = "http://localhost:5000") => {
  const response = await axios.get(`${baseUrl}/author/${encodeURIComponent(author)}`);
  return response.data;
};

const getBooksByTitle = async (title, baseUrl = "http://localhost:5000") => {
  const response = await axios.get(`${baseUrl}/title/${encodeURIComponent(title)}`);
  return response.data;
};


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).type('json').send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  return res.status(200).type('json').send(JSON.stringify(book, null, 2));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  return res.status(200).type('json').send(JSON.stringify(matchingBooks, null, 2));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  return res.status(200).type('json').send(JSON.stringify(matchingBooks, null, 2));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  return res.status(200).type('json').send(JSON.stringify(book.reviews, null, 2));
});

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
