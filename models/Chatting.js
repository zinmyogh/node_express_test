const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // sender: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  // reciever: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  // message: {type: String},
  sender: {type: String},
  reciever: {type: String},
  message: {type: String},
  message_time: {type: Date, default: Date.now()},
  read: {type: Boolean, default: false}
})

module.exports = mongoose.model('Chatting', schema);