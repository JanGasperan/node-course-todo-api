const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// const todos = [{
//   _id: new Object(),
//   text: "First test todo"
// }, {
//   _id: new Object(),
//   text: "Second test todo"
// }
// ];

const todos = [{
  _id: new ObjectID(),
  text: "First test todo"
}, {
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 3333
}
];

// do something before each test
beforeEach((done) => {
  Todo.remove().then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should NOT create a new todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
    });
  });

  describe('GET /todo/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 is todo not found', (done) => {
      request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for not-object ids', (done) => {
      request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });

  });

  describe('DELETE /todo/:id', () => {
    it('should remove a todo', (done) => {
      var hexId = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) =>{
          if (err) {
            return done(err);
          }

          Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for not-object ids', (done) => {
      request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });

  });

  describe('PATCH /todo/:id', () => {
    it('should update the todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var updateTodo = {text : "Some new text", completed: true};
      request(app)
        .patch(`/todos/${hexId}`)
        .send(updateTodo)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(updateTodo.text);
          expect(res.body.todo.completed).toBe(updateTodo.completed);
          expect(res.body.todo.completedAt).toBeA("number");
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed ', (done) => {
      var hexId = todos[1]._id.toHexString();
      var updateTodo = {text : "Some other text", completed: false};
      request(app)
        .patch(`/todos/${hexId}`)
        .send(updateTodo)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(updateTodo.text);
          expect(res.body.todo.completed).toBe(updateTodo.completed);
          expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
  });

});
