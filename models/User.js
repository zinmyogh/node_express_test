const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment-fix');

const schema = new mongoose.Schema({
  // ntm_id: {type: Number},
  username: { type: String },
  password: {
    type: String,
    set(val) {
      return require("bcrypt").hashSync(val, 12);
    }
  },
  friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Friends" }],
  createdAt: {
    type: Date,
    default: Date.now
    // expires: '5'
  } //注册时间
  // timestamps: true
  // ntm_Id: String, // 聊天号，uuid.
});
// schema.index({ ntm_id:1 }, { unique: true });

// autoIncrement.initialize(mongoose.connection);

// //下面用自增插件，实现id的自增功能
// schema.plugin(autoIncrement.plugin, {
//   model: 'User',
//   field: 'ntm_id',
//   startAt: 100000,
//   incrementBy: 1
// });
// schema.plugin(AutoIncrement, {inc_field: 'idBar'});

module.exports = mongoose.model("User", schema);
// let mongoose = require('mongoose');
// let autoIncrement = require('mongoose-auto-increment-fix');  //用这个fix版本，可以避免在mongodb 3.2以上的版本报错。

// let Schema = mongoose.Schema;

// let schema = new Schema({
//     id            : {type:Number},
//     typeid        : {type:Number, default: 0, min:0, max:3},  //有缺少值，和最小值最大值
//     name          : {type:String, default:'', trim:true},     //有trim，可以去掉前后空格
//     password      : {type:String, default:'', trim:true},
//     nickname      : {type:String, default:'', trim:true},
//     sex           : {type:Number, default:0, min:0, max:2},
//     photo         : {type:String, default:'', trim:true},
//     status        : {type:Number, default:1, min:0, max:3},
//     registertime  : {type:Date,   default:Date.now},		//日期类型的缺省值
//     lastlogintime : {type:Date,   default:Date.now},
//     lastloginip   : {type:String, trim:true},
//     idcard        : {type:String, default:'', index:true},  //这里可以定义对idcard的索引
//     realnamecount : {type:Number, default:5},
//     newaccountflag: {type:Boolean, default:true}  //boolean类型
// });

// schema.index({ name:1}, { unique: true });
// schema.index({ id:1 }, { unique: true });

// autoIncrement.initialize(mongoose.connection);
// //下面用自增插件，实现id的自增功能
// schema.plugin(autoIncrement.plugin, {
//     model: 'User',
//     field: 'id',
//     startAt: 10000,
//     incrementBy: 1
// });
// module.exports.schema = mongoose.model("User", schema);
