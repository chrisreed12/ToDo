const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/toDoDB", {useNewUrlParser: true});

const db = mongoose.connection;

const toDoSchema = new mongoose.Schema({
    toDo: {
        type: String,
        required: true
    },
});

const ToDo = mongoose.model("ToDo", toDoSchema);

exports.addToDo = async function (newToDo) {

    const addToDo = new ToDo({
        toDo: newToDo,
    });
    db.once("open", function(){
        addToDo.save().then(() => {mongoose.connection.close() });
    });
    
    
}

exports.getToDos = async function () {
    
    db.once("open", async function() {
        const ToDos = await ToDo.find().then((results) => {
            mongoose.connection.close();
            return results
        })
        
        console.log(ToDos);
    
        return ToDos;
    });
}

exports.deleteToDo  = async function (toDo) {
    await ToDo.deleteOne({_id: toDo._id}, function(err){
        if(err){
            return err;
        }else{
            return `${toDo.toDo} deleted`;
        }
    })
    mongoose.connection.close();
}

exports.updateToDo = function (toDo) {
    
    mongoose.connection.close();
}