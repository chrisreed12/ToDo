const express = require('express');
const parser = require('body-parser');
const bodyParser = require('body-parser');
const { application } = require('express');
const app = express();
const date = require(__dirname+"/date.js");

let todos = [];
let workTodos = [];
let day = date();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
   
    res.render('list', {listTitle: "Home", day: day, todos: todos, postRoute: '/'});
});

app.post('/', function(req, res){

    todos.push(req.body.addTodo);
    res.redirect('/');
})

app.get('/work', function(req, res){

    res.render('list', {listTitle: 'Work', day: day, todos: workTodos, postRoute: '/work'});
})

app.post('/work', function(req, res){

    workTodos.push(req.body.addTodo);
    res.redirect('/work');
})

app.get('/about', function(req, res){
    res.render('about');
})

app.listen(3000, function(){
    console.log('Server started on port 3000');
});

//TODO -> Add delete functionality to remove item from the list
