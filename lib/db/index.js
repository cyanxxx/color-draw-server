var mongoose = require('mongoose');
var credentials = require('./credentials');

var opts = {
  auto_reconnect: true,
  useNewUrlParser: true
};

mongoose.connect(credentials.mongo.development.connectionString, opts);
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
var qsSchema = mongoose.Schema({
  key: String,
  tip: String,
  random: {type:Number,index:true}
});

var Qs = mongoose.model('Qs', qsSchema);

module.exports = Qs;
