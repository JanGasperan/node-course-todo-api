const {MongoClient, ObjectID} = require("mongodb"); // this is identical to the code above. We using destructuring

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos, err');;
  }); // find returns a cursor

  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log('Todos not completed');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos, err');;
  }); // find returns a cursor

  db.collection('Todos').find({
    _id: new ObjectID('5ae06c19678c421cd8084d52') // need to use '' do not use ""!!!
    }).toArray().then((docs) => {
    console.log('Todos by id');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos, err');;
  }); // find returns a cursor

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('Unable to fetch todos, err');;
  }); // find returns a cursor


  db.collection('Users').find({name: 'Jan'}).toArray().then((docs) => {
    console.log('Users with name Jan');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos, err');;
  }); // find returns a cursor

  // db.close();
});
