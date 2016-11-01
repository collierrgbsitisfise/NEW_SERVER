//init requaries
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cntr = require('./controllers');

//port on wich WORK
var PORT = 3030;

// create connection to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'userofBlog',
    password: 'Password_1919_Strong',
    database: 'BlogDataBase'
});


//set headers
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

//use bodyParser
app.use(bodyParser.json());


//if was send wrong data by client
app.use(function logJsonParseError(err, req, res, next) {
    if (err.status === 400 && err.name === 'SyntaxError' && err.body) {
        console.log('JSON body parser error!');
        console.log('send valid JSON');
        res.send('send valid JSON');
    } else {

        next();

    }
});


//GET request get all posts
app.get('/', cntr.getAllPosts);
//verify authoris
app.post('/myposts' , cntr.getMyPosts);
//autho
app.post('/authorisation' , cntr.authUser);
//add new user
app.put('/signin' , cntr.singInUser);
//add new post
app.put('/addpost' , cntr.addPost);
//delete poost
app.delete('/deletepost' , cntr.delPost);
//add commet
app.put('/addcomment' , cntr.addComment);
//delete comment
app.delete('/deletecomment' , cntr.dellComment);
//get all coments for post
app.post('/getcomments', cntr.getCommentsByPost);
//change rating post
app.post('/changeratingpost' , cntr.changeRatingPost);


//start server
app.listen(PORT, function () {
    console.log('WORK ON http://localhost'+PORT);
});
