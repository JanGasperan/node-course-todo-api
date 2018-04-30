var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // setup to use promises
mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
