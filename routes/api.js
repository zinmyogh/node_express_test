"use strict";
module.exports = app => {
  const fs = require("fs"),
    plugin = require("../plugin/main"),
    path = require("path"),
    User = require("../models/User"),
    Contact = require("../models/Contact"),
    UserInfo = require("../models/UserInfo"),
    Friend = require("../models/Friends"),
    upload = require("../util/upload"),
    authMiddle = require("../middleware/auth"); //登录校验中间件

  app.get("/", (req, res, next) => {
    res.send("ok");
    next();
  });
  // Register for new user
  app.post("/api/register", (req, res) => {
    try {
      User.find({ username: req.body.username }, async (err, doc) => {
        if (doc.length < 1) {
          var user = new User(req.body);
          user.save((err, doc) => {
            // if (err) res.send(err);
            if (err) {
              console.log(err);
            }
            console.log(doc);
            Contact.create({ user_id: doc._id });
            UserInfo.create({ user_id: doc._id });
            res.send({
              status: "success",
              message: "register success!",
              userInfo: doc
            });
          });
        } else {
          res.send({ msg: "ale" });
        }
      });
    } catch (err) {
      res.send({ error: err });
    }
  });

  //Login for authorize users
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username });
    const id = user._id;
    //process.on('unhandledRejection', (reason, p) => {console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)})
    if (!user) {
      return res.status(422).send({
        message: "not a user!",
        status: 422
      });
    }
    const isValiad = require("bcrypt").compareSync(password, user.password);
    if (!isValiad) {
      return res.status(423).send({
        message: "password invalid!",
        status: 423
      });
    }
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: user._id }, plugin.secret);
    UserInfo.findOne({ user_id: id }, function(err, doc) {
      var url = doc.avatorUrl;

      console.log(url);
      res.send({
        status: 200,
        username: username,
        message: "login successful",
        token: token,
        avatorUrl: url
      });
    });
  });

  //图片上传  photos upload
  app.post("/api/upload", authMiddle(), upload.single("file"), (req, res) => {
    try {
      const file = req.file;
      // console.log("req.file ... .... "+file)
      file.url = `http://192.168.43.166:3000/statics/images/${file.filename}`;
      // file.url = `http://192.168.2.124:3000/statics/images/${file.filename}`;
      //save to userinfo table
      const avator = { avatorUrl: file.url };
      const user_id = req.user._id;
      console.log("id,............" + user_id);
      UserInfo.findOne({ user_id }, function(err, doc) {
        // console.log("doc.... ..... "+doc)
        // let sp = doc.avatorUrl.split('/');
        // console.log("sp .....  "+ sp[5]);
        if (doc.avatorUrl == "" || !doc.avatorUrl) {
          return;
        } else {
          //调用fs模块的unlinkSync方法，传入文件路径，直接删除。也可以用fs.unlink(callback)这个异步删除
          fs.unlink(
            path.join(
              __dirname,
              "..",
              "/public/images/",
              doc.avatorUrl.split("/")[5]
            ),
            err => {
              if (err) {
                console.log(err);
              } else {
                console.log("delete success");
              }
            }
          );
        }
      });
      UserInfo.findOneAndUpdate({ user_id }, avator, function(err, doc) {
        if (err) {
          throw err;
        } else {
          console.log(doc);
        }
      });
      res.json(file);
    } catch (err) {
      res.send({ err: err });
    }
  });

  //获取图片 photo download
  app.get("/image/:file", authMiddle(), function(req, res) {
    try {
      let file = req.params.file;
      console.log("file .....  " + file);
      let fileLocation = path.join(
        __dirname,
        "..",
        "..",
        "chat/public/images/",
        file
      );
      console.log("filelocation ....    " + fileLocation);
      res.sendFile(`${fileLocation}`);
    } catch (err) {
      res.send({ err: err });
    }
  });

  //搜索好友
  app.post("/api/searchfriends", async (req, res) => {
    try {
      const username = req.body.username;
      console.log(req.body);
      let friend = await User.findOne({ username });
      if (!friend || friend == "") {
        return res.send({
          status: 404,
          message: "No such user!"
        });
      } else {
        res.json({ id: friend._id, username: friend.username });
      }
    } catch (e) {
      res.send(e);
    }
  });

  //addFriends Testing
  app.post("/addfriends", authMiddle(), async (req, res) => {
    try {
      const username = req.body.username;
      console.log("username .... " + username);
      User.findOne({ username: username }, async (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          console.log("doc .... ... ...  " + doc);
          const docA = await Friend.create(
            { requester: req.user._id, recipient: doc._id },
            { $set: { status: 1 } },
            { upsert: true, new: true }
          );
          const docB = await Friend.create(
            { recipient: req.user, _id, requester: doc._id },
            { $set: { status: 2 } },
            { upsert: true, new: true }
          );
          const updateUserA = await User.findOneAndUpdate(
            { username: zinn },
            { $push: { friends: docA._id } }
          );
          const updateUserB = await User.findOneAndUpdate(
            { username: heee },
            { $push: { friends: docB._id } }
          );
        }
      });
    } catch (err) {
      console.log({ err: err });
    }
  });

  // //update userinfo
  // app.post('/api/updateinfo', authMiddle(), async(req, res) => {
  //   try{
  //     // const user = req.body;
  //     const u_id = req.user._id;

  //   }catch(err){
  //     console.log("update userinfo error"+ err)
  //   }
  // })

  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    });
  });
};

// NODE端代码
// node端将后台的response信息全部转发给客户端，不做任何处理
// app.post('/file/download', (req, res, next) => {
//     request.get({
//         url: `${CONFIG.api.speechMark}/file/download?filePath=${req.body.filePath}`,
//         json: req.body,
//         gzip:true,
//         headers:{
//             'Content-Type': 'application/octet-stream',
//             'usertoken': req.headers.usertoken,
//         },
//     }).on('response', function(response) {
//         console.log(response.statusCode) // 200
//         console.log(response.headers)
//         // console.log(response.headers['content-type']) // 'image/png'
//         // res.headers['content-type'] = response.headers['content-type']
//         this.pipe(res)
//       });
// });

//   app.post('/user/_id',(req,res)=>{0
//     let token = req.get("Authorization"); // 从Authorization中获取token
//     //let secretOrPrivateKey="zin"; // 这是加密的key（密钥）
//     jwt.verify(token, app.get('secret'), (err, decode)=> {
//         if (err) {  //  时间失效的时候 || 伪造的token
//             res.send({'status':10010});
//         } else {
//             res.send({'status':10000});
//         }
//     })
// });

// 5.API路由处理 拦截验证JWT
// //  localhost:端口号/api 路径路由定义
// var apiRoutes = express.Router();
// apiRoutes.use(function(req, res, next) {
//     // 拿取token 数据 按照自己传递方式写
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (token) {
//         // 解码 token (验证 secret 和检查有效期（exp）)
//         jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//               if (err) {
//             return res.json({ success: false, message: '无效的token.' });
//               } else {
//                 // 如果验证通过，在req中写入解密结果
//                 req.decoded = decoded;
//                 //console.log(decoded)  ;
//                 next(); //继续下一步路由
//           }
//         });
//       } else {
//         // 没有拿到token 返回错误
//         return res.status(403).send({
//             success: false,
//             message: '没有找到token.'
//         });
//       }
//     });
// 6.JWT验证后操作
// //API跟路径返回内容
// apiRoutes.get('/', function(req, res) {
//   res.json({ message: req.decoded._doc.name+'  欢迎使用API' });
// });
// //获取所有用户数据
// apiRoutes.get('/users', function(req, res) {
//   User.find({}, function(err, users) {
// res.json(users);
//   });
// });
// // 注册API路由
// app.use('/api', apiRoutes);

// /////////////
// UserSchema = new mongoose.Schema({
//   username: String,
//   email:  String,
//   password: String,
//   language: { type: String, default: "English" },
//   profilePicture: { type: String, default: "/images/talk/blank-profile-picture.png" },
//   status: String,
//   pendingFriends: [this],
//   friends: [this]
// })
// //添加好友
// app.post("/addfriends", function(req, res) {
//   var pendingIds, friendIds;
//   if (req.user.pendingFriends.length > 0) {
//       pendingIds = new Array(req.user.pendingFriends.length - 1);
//       req.user.pendingFriends.forEach(function (pendingFriend) {
//           pendingIds.push(pendingFriend._id);
//           console.log("Pending friend id: " + pendingFriend._id);
//       })
//   }
//   if (req.user.friends.length > 0) {
//       friendIds = new Array(req.user.friends.length - 1);
//       req.user.friends.forEach(function (friend) {
//           friendIds.push(friend._id);
//           console.log("Friend id: " + friend._id);
//       })
//   }
//   var conditions = {
//       $or: [
//           {$and: [
//               {_id: {$nin: pendingIds}}, // not a pending friend of U2
//               {_id: {$nin: friendIds}},        // not a friend of U2
//               {username: req.body.globalUserName},
//               {'pendingFriends._id.toString()': {$ne: req.user._id.toString()}}, // U2 is not a pending friend
//               {'friends._id.toString()': {$ne: req.user._id.toString()}}         // U2 is not a friend
//           ]}
//       ]
//   }
//   var update = {
//       $addToSet: {pendingFriends: { _id: req.user._id.toString(), username: req.user.username, language: req.user.language, profilePicture: req.user.profilePicture}}
//   }

//   User.findOneAndUpdate(conditions, update, function(error, doc) {
//       if(error) {
//           console.log(currentTime + " - FRIEND_REQUEST_SEND_ERROR: '" + req.user.username + "' TRIED TO SEND A FRIEND REQUEST TO '" + req.body.globalUserName + "'");
//       }
//       else {
//           console.log(currentTime + " - FRIEND_REQUEST_SENT: '" + req.user.username + "' SENT A FRIEND REQUEST TO '" + req.body.globalUserName + "'");
//       }
//       res.redirect("/talk");
//   });
// });
/////////////////////////////////////////////////////////////
// app.post('/addfriends', authMiddle(), async (req, res) => {
//   const friend =  await User.findOne(req.body);
//   console.log("friend.username  .... . ....   "+friend.username);
//   try {
//     console.log("req.user._id  " + req.user._id);
//     Contact.findOneAndUpdate({user_id: req.user._id}, {$push: {friend_lists: {friend_id: friend._id, username: friend.username} }},
//       {upsert: true, save: true}, (err, Contact) => {
//         if(err)console.log(err);
//         Contact.friend_lists.push(friend._id);
//         Contact.save;
//       })
//         Contact.findOneAndUpdate({user_id: friend._id}, {$push: {friend_lists: {friend_id: req.user._id, username: req.user.username}}},
//           {upsert: true, save: true}, (err, Contact) => {
//             if(err){
//               console.log(err)
//             }else{
//             Contact.friend_lists.push(req.user._id);
//             Contact.save;
//             res.send({message: "You two are now friend each other.Congrats..."});
//             }
//           });
//         } catch(e) {
//             res.send({e: e});
//         }
//       })
