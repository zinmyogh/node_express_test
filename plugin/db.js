module.exports = app => {
  const mongoose =require('mongoose'),
  plugin = require('../plugin/main');
  const DB_URL = plugin.database;  //database name
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
 
require('require-all')(__dirname + '/../models');
  /**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
  console.log('Mongoose connection open to ' + DB_URL);
});    

/**
* 连接异常
*/
mongoose.connection.on('error',function (err) {    
  console.log('Mongoose connection error: ' + err);
});    

/**
* 连接断开
*/
mongoose.connection.on('disconnected', function () {    
  console.log('Mongoose connection disconnected');
}); 
}