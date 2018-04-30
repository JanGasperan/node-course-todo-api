var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // setup to use promises
mongoose.connect(process.env.DATABASEURL);

module.exports = {mongoose};
