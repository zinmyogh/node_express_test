const mongoose =require('mongoose');

const schema = new mongoose.Schema({
  user_id: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  nickname: {type: String},
  gender: {
    type: String,
    default: "female"
  },
  avatorUrl: {type: String},
  location: {type: String},
  bio: {type: String},
  // is_active: {
  //   type: Boolean,
  //   default: false
  // },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})
// userinfo.statics = {
//   findUserNameById: function(userinfoId, callback){
//     return this.findOne({_id: userinfoId}).populate('userId')
//     .exec(callback)
//   }
// }
module.exports = mongoose.model('UserInfo', schema);