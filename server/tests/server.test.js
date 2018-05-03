const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

  describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) =>{
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) =>{
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

  describe('POS /users/', () => {
    it('should create a user', (done) => {
      var email = 'bubo.gee@gmail.com';
      var password = '123mbkg!';
      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) =>{
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));;
        });
    });
    it('should return validation errors if request invalid', (done) => {
      var email = 'bubo.gee';
      var password = '12g!';
      request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
    it('should not create user if email in use', (done) => {
      request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: users[0].passwordS
        })
        .expect(400)
        .end(done);
    });
  });

  describe('POS /users/login', () => {
    it('should login a user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({email: users[1].email,
          password:users[1].password })
        .expect(200)
        .expect((res) =>{
          expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));
        });
    });
    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({email: users[1].email,
          password: "blaaaaadef" })
        .expect(400)
        .expect((res) =>{
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            User.findById(users[1]._id).then((user) => {
              expect(user.tokens).toNotExist();
              done();
            }).catch((e) => done(e));
            done();
          }).catch((e) => done(e));
        });
    });
  });

});
