const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var userId = '5ae6bf8cb5a0b48c11123480';

// var id = '5ae6d403e99722ac140824a111';
//
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos', todo)
// });

// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todo)
// }).catch((e) => concole.log(e));

User.findById(userId).then((user) => {
  if(!user) {
    return console.log('Id not found');
  }
  console.log('Todo by Id', user)
}).catch((e) => concole.log(e));
