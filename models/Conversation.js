// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const schema = new Schema({
//   message:{
//     type: String,
//     enum:['text', 'audio', 'video'],
//     default: ['text']
//   },
//   m_time:{type: Date, default: Date.now()}
// })

// module.exports = mongoose.model('Conversation', schema);

const mongoose = require('mongoose'),
Shcema = mongoose.Schema;

const schema = new Shcema({
  participants: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'},]
});

module.exports = mongoose.model('Conversation', schema);