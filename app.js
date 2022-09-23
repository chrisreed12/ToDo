const express = require('express');
const bodyParser = require('body-parser');
const { application } = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/toDoDB");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

const todoSchema = {
    name: {
        type: String,
        require: true
    }
}

const ToDo = new mongoose.model("ToDo", todoSchema);

const listSchema = {
    name: String,
    todos: [todoSchema]
}

const List = mongoose.model("List", listSchema);

app.get('/', function(req, res){
    List.findOne({name: 'Today'}, function(err, today){
        if(!err){
            if(!today){
                const list = new List({
                    name: 'Today',
                    todos: []
                });
                list.save();
                res.redirect("/");
            }else{
                res.render("list", {listTitle: 'Today', todos: today.todos});
            }
        }
    });
})

app.get('/:listName', function(req, res){
    const listName = req.params.listName;

    List.findOne({name: listName}, function(err, foundList){
        if(!err){
            if(!foundList){
                // Create new list
                const list = new List({
                    name: listName,
                    todos: []
                });
            
                list.save();
                res.redirect("/"+listName);
            }else{
                // Get existing list
                res.render("list", {listTitle: foundList.name, todos: foundList.todos});
            }
        }
    })
})

app.post('/', function(req, res){

    const listName = req.body.list;
    
    const toDo = new ToDo({
        name: req.body.addTodo,
    });
    
    if(listName === 'Today'){
        List.findOne({name: 'Today'}, function(err, today){
            today.todos.push(toDo);
            today.save();
            res.redirect('/');
        })
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.todos.push(toDo);
            foundList.save();
            res.redirect('/'+listName);
        });
    }
})

app.post('/delete', function(req, res){
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;
   
    List.findOneAndUpdate({name: listName}, {$pull: {todos: {_id: checkedItem}}}, function(err, foundList){
        if (!err){
            if(listName === 'Today'){
                res.redirect('/');
            }else{
                res.redirect('/'+listName);
            }
        }
    })
       
});


app.listen(process.env.PORT || 3000, function(){
    console.log('Server started on port 3000');
})


