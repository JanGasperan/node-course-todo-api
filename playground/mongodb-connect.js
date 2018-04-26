// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); // this is identical to the code above. We using destructuring

var obj = new ObjectID();
console.log(obj); // we get an object ID

//Object descructurization is6
// var user = {name: 'Jan', age: 25};
// var {name} = user; // pull out the name property with value from the object user into a new variable 'name'.
//
// console.log(name);

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // we can set the _id if we want.
  // db.collection('Users').insertOne({
  //   name: 'Jan',
  //   age: 34,
  //   location: 'Bratislava Romanova 40'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //
  //   console.log(result.ops[0]._id.getTimestamp());
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.close();
});
