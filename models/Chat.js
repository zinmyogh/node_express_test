const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  from_id: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  to_id: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  conv_id: {type: mongoose.SchemaTypes.ObjectId, ref: 'Conversation'}
})

module.exports = mongoose.model('Chat', schema);