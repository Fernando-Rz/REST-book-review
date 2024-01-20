const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"fernando","password":"12345"}];


const doesExist = (username)=>{
    let usersWithSameName = users.filter((user)=>{
        return user.username === username
    });

    return usersWithSameName.length > 0; 
}

const isValid = (username)=>{
    if(!doesExist(username)){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    let validUsers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if(validUsers.length > 0){
        return true;
    } else {
        return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
    const reviewText = req.query.review;

    if (!books[isbn]) {
        return res.status(404).send('Invalid ISBN');
    }

    if( books[isbn].reviews[username]){
        books[isbn].reviews[username] = reviewText; 
    } else {
        books[isbn].reviews[username] = reviewText;
    }

    res.status(200).send('Book review successfully posted');
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).send('Invalid ISBN');
    }

    delete books[isbn].reviews[username];

    res.status(200).send('Book review successfully deleted');
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;