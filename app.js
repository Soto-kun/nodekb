const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { title } = require('process');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});
 
// Check for DB erros
db.on('error', function(err){
    console.log(err);
});

// init App
const app = express();

//Bring in Models
let Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));

//parse application/json
app.use(bodyParser.json());

//Set public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', async(req, res)=>{ //MongoDB Doesn't accept call back function anymore
    let articles = {};
    try{
        articles = await Article.find();
    }catch(err){
        CSSCounterStyleRule.log(err);
    }
    res.render('index', {
        title: 'Articles',
        articles: articles
    });
});

//Add Rout
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add Submit Post
app.post('/articles/add', function(req, res){
    try{
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        article.save().then(()=>{
            res.redirect('/');
        }).catch((err)=>{
            console.log(err);
        })
    }catch(err){
        console.log(err);
    }
});
// Start Server
app.listen(3000, function () {
   console.log('Server stared on port 3000...'); 
});