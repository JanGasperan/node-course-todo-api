var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // setup to use promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: 'Eat Breakfast',
  completed: true,
  completedAt: Date.now()
});

newTodo.save().then((doc) => {
  console.log(doc);
}, (e) => {
  console.log('Unable to save todo');
});
