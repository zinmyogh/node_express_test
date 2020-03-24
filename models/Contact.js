const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  // friend_lists: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  friend_lists: [{
    friend_id: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    username: {type: String},
    _id: false
}],
  group_lists: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Group'}],
  block_lists: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
})

module.exports = mongoose.model('Contact', schema);