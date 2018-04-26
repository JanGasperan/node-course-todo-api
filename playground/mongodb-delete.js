const {MongoClient, ObjectID} = require("mongodb"); // this is identical to the code above. We using destructuring

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) =>{
  //   console.log(result);
  // });

  // deleteOne -- delete only the first match
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) =>{
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) =>{
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5ae18d9b40e553f26872bc73')}).then((result) =>{
    console.log(result);
  });

  // db.collection('Users').deleteMany({name: 'Jan'}).then((result) =>{
  //   console.log(result);
  // });

  // db.close();
});
