const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//   console.log(res);
// });

// Methods for delete both return the deleted object
// Todo.findOneAndRemove();
// Todo.findByIdAndRemove();

Todo.findByIdAndRemove('5ae6ed2c7b0057e05ecf69c6').then((todo) => {
  console.log(todo);
});
