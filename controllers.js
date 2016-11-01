var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

// create connection to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'userofBlog',
    password: 'Password_1919_Strong',
    database: 'BlogDataBase'
});


exports.getAllPosts = function(req , res) {
    console.log('get all posts');
    var quaryString = "select u.nick_name , p.title , p.text_post , p.post_id, u.user_id, p.datePost , p.post_rating\
                        from postsBlog as p inner join usersBlog as u on p.user_id = u.user_id";
    connection.query(quaryString , function(err , rows, fields) {

        if (err) { //if was an Error

             res.status(err.code).send(err.msg);
             throw err;
        }


        res.send(rows);
    });
};

exports.authUser = function(req , res){
    console.log('user try to auth');
    var quaryString = "SELECT * FROM usersBlog WHERE login = '" + req.body.login + "' and passwordU ='"  + req.body.passwordU + "'";
    connection.query(quaryString , function(err , rows ,filds){
        if (err) {

            res.status(err.code).send(err.msg);
            throw err;

        }

        if (rows.length === 0) {
            res.send([]);
        }else{
            console.log(rows[0]);
            res.send(rows);
        }

    });
};

exports.singInUser = function(req , res){
    console.log('sign_in');
    var quaryString = "SELECT * FROM usersBlog WHERE login = '" + req.body.login + "'";

    connection.query(quaryString , function(err , rows ,filds){
        if (err) {

            res.status(err.code).send(err.msg);
            throw err;

        }

        if (rows.length === 0) {
            //if login dose not exists in databse do ....
            quaryString = "INSERT INTO usersBlog (login , passwordU , nick_name) VALUES('" +req.body.login + "' , '" + req.body.passwordU + "' , '" + req.body.nick_name + "')";
            connection.query(quaryString , function(err , rows , fild){

                    if (err) {

                        res.status(err.code).send(err.msg);
                        throw err;
                    }

                    res.send(true);

            });

        }else{
            //if same login exists already
            res.send(false);
        }

    });
};

exports.addPost = function(req , res){
    console.log('put addpost');
    var quaryString = "INSERT INTO postsBlog (title , text_post , datePost , user_id , post_rating) VALUES ('" + req.body.title + "','"+ req.body.text_post + "'," + req.body.datePost + "," + req.body.user_id +","+req.body.post_rating + ")";
    connection.query(quaryString , function(err , rows , fild){

            if (err) {

                res.status(err.code).send(err.msg);
                throw err;

            }

            res.send(true);

    });
};

exports.delPost = function(req ,res){
    console.log('delete post');
    //quary  for delete all in parent table
    var quaryString = "DELETE  FROM postsBlog WHERE post_id = " + req.body.post_id;

    console.log(quaryString);

    connection.query(quaryString , function(err , rows , fild){

            if (err) {

                res.status(err.code).send(err.msg);
                throw err;

            }

            res.send(true);


    });
};

exports.addComment = function(req ,res){
    console.log('add comment');
    var quaryString = "INSERT INTO commentBlog (comment_text , comment_rating , user_id ,post_id) VALUES ('" + req.body.comment_text + "',"+ req.body.comment_rating + "," + req.body.user_id + "," + req.body.post_id +")";
    console.log(quaryString);

    connection.query(quaryString , function(err , rows , fild){

            if (err) {

                res.status(err.code).send(err.msg);
                throw err;

            }

            res.send(true);

    });
};

exports.dellComment = function(req , res){
    console.log('delete comment');
    var quaryString = "DELETE FROM commentBlog WHERE comment_id = " + req.body.comment_id + " and user_id =  " + req.body.user_id;

    connection.query(quaryString , function(err , rows, filds){

        if (err) {

            res.status(err.code).send(err.msg);
            throw err;

        }

        console.log(filds);
        res.send(true);

    });
};


exports.getMyPosts = function(req , res) {
    console.log('only his posts')
    var quaryString = "select u.nick_name , u.user_id ,p.title, p.post_id , p.text_post , p.datePost , p.post_rating\
                        from postsBlog as p inner join usersBlog as u on p.user_id = u.user_id\
                         WHERE u.user_id = " + req.body.user_id;
    connection.query(quaryString , function(err , rows, fields) {

        if (err) { //if was an Error

             res.status(err.code).send(err.msg);
             throw err;
        }


        res.send(rows);
    });
};


exports.getCommentsByPost = function(req , res){
    console.log('get getcomments');
    var quaryString = "SELECT u.nick_name , c.comment_id , c.comment_text , u.user_id FROM  commentBlog as c inner join usersBlog as u \
     ON u.user_id = c.user_id \
     WHERE c.post_id = " + req.body.post_id;
    console.log(quaryString);
    connection.query(quaryString , function(err , rows, filds){

        if (err) {

            res.status(err.code).send(err.msg);
            throw err;

        }

        res.send(rows);

    });
};

exports.changeRatingPost = function(req ,res){
    var quaryString = "SELECT state FROM ratingPost WHERE user_id = " + req.body.user_id + " and post_id = " + req.body.post_id;
    var quaryString2 = "";
    console.log(quaryString);
    connection.query(quaryString , function(err , rows, filds){

        if (err) {
            console.log("ERR1 : " + err);
            res.status(err.code).send(err.msg);
            res.send(false);

        }
        console.log(rows);
        if (rows.length === 0) { //if this user dont add any mark to this post

            if (Boolean(req.body.state) === true) { //if plus rating
                console.log('+');
                quaryString = "UPDATE postsBlog SET post_rating = post_rating + 1 WHERE post_id = " + req.body.post_id;
                quaryString2 = "INSERT INTO ratingPost(user_id , post_id , state) VALUES (" + req.body.user_id + "," + req.body.post_id + "," + true + ")";
                connection.query(quaryString , function(err , rows , filds) {
                    if (err) {
                        res.send(false);
                    }
                    connection.query(quaryString2 , function(err , rows , filds) {
                        if (err) {
                            res.send(false);
                        }
                        res.send(true);
                    });
                });
            } else { //if minus rating

                console.log('-');
                quaryString = "UPDATE postsBlog SET post_rating = post_rating - 1 WHERE post_id = " +  req.body.post_id;
                quaryString2 = "INSERT INTO ratingPost(user_id , post_id , state) VALUES (" + req.body.user_id + "," + req.body.post_id + "," + false + ")";
                connection.query(quaryString , function(err , rows , filds) {
                    if (err) {
                        res.send(false);
                    }
                    connection.query(quaryString2 , function(err , rows , filds) {
                        if (err) {
                            res.send(false);
                        }
                        res.send(true);
                    });
                });
            }

        } else {

            res.send(false);

        }

    });
};
