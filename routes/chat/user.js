'use strict';
const express = require('express'),
utils = require('utility'),
User = require('../../models/User'),
Contact = require('../../models/Contact'),
Router = express.Router(), //路由对象
_filter = {'password':0, '__v':0}; //查询条件 不显示密码和版本号

//用户信息列表 get all user list data
Router.get('/', function(req, res){
    try{
        req.Model.find().populate("user_id").exec(function(err, doc){
            console.log(doc);
            res.send(doc);
        })
    }catch(err){
        res.send({err : err});
    }
})

//获取单人信息 get one user data by _id
Router.get('/:_id', function(req, res) {
const userId = req.params;
    console.log(userId);
    req.Model.findOne(userId, function(err, doc){
        if(err){
            res.status(400).send({err:err});
        }else{
            res.status(200).send(doc);
            }
    });
})
//修改用户基本资料 update user information 
Router.put('/', function(req, res){
    try{
        console.log("nick ....  "+req.body.nickname)
        const userInfo = req.body;
        const user_id = req.user._id;
        console.log("user_id ..... " + user_id)
        req.Model.findOneAndUpdate({user_id}, userInfo, function(err, doc){
            if(err){
                throw err;
            }else{
                res.send(userInfo);
                // res.send({message: 'Successfully update your information', userInfo});
            }
        })
        }catch(err){
            res.send({err: err});
        }
    })
//标识已读
Router.post('/readmsg', function(req, res){
    const userid = req.cookies.userid;
    const {from} = req.body;
    console.log(userid, from);
    Chat.update({from, to:userid}, 
                {'$set':{read:true}}, 
                {'multi':true},function(err, doc){
        if(!err){
            return res.json({code:0, num:doc.nModified});
        }
        return res.json({code:1, msg:'修改失败'});
    })
})
//更新信息
Router.post('/update', function(req, res){
    const userid = req.cookies.userid;
    if(!userid){
        return json.dumps({code:1});
    }
    const body = req.body;
    User.findByIdAndUpdate(userid, body, function(err, doc){
        const data = Object.assign({},{
            user: doc.user,
            type: doc.type,
        }, body)
        return res.json({code:0, data});
    })
})


//添加好友
Router.post('/addfriends', async (req, res) => {
    const {username, resName} = req.body;
    console.log(req.body);
    try {
        let requser = await User.findOne({ username: { $eq: username } });
        console.log(requser._id);
        if(!requser_id || requser_id == ""){ 
            return ;
        }else{
            Contact.findOneAndUpdate({_id: requser._id}, {$push: {friend_lists: newPush}}, {upsert: true, save: true}, (err, user) => {
                if (err) console.log(err);
                Contact.friend_lists.push(friend._id);
                Contact.save;
                //res.redirect(req.get('referer'));
                console.log(requser._id);
            });
           //res.send({id: requser._id, username: requser.username})
        }
    } catch(e) {
        res.send(e);
    }
})


//用户信息
Router.get('/info', function(req, res){
    //用户cookie校验
    const {_id} = req.cookies;
    if(!_id){
        return res.json({code:1});
    }
    User.findOne({_id: _id}, _filter, function(err, doc){
        if(err){
            return res.json({code:1, msg:'后端出错了'});
        }
        if(doc){
            return res.json({code:0, data:doc});
        }
    })
    
})
//获取聊天信息列表
Router.get('/getmsglist', function(req, res){
    const user = req.cookies._id;
    User.find({}, function(e, userdoc){
        let users = {};
        userdoc.forEach(v=>{
            users[v._id] = {name:v.user, avatar:v.avatar}
        })
        Chat.find({'$or':[{from:user},{to:user}]}, function(err, doc){
            if(err){
                return res.json({code:1, msg:'后端出错了'})
            }
            if(doc){
                return res.json({code:0, msgs:doc, users:users})
            }
        })
    })
})

module.exports = Router;



 //密码加密
// function md5Pwd(password){
//     const salt = 'imooc_is_good_3957x8yza6!@#IUHJh~~'
//     return utils.md5(utils.md5(password+salt))
// }
//用户登录
// Router.post('/login', async (req, res) => {
//     const {username, password} = req.body
//     console.log(req.body)
//     User.findOne({username, password:md5Pwd(password)},{'password':0}, function(err, doc){
//         if(!doc){
//             return res.json({code:1, msg:'用户名或者密码错误'})
//         }
//         res.cookie('_id', doc._id)
//         return res.json({code:0, status:200, data:doc})
//     })
// })
//用户注册
// Router.post('/register', function(req, res){
//     const {username, password} = req.body
//     User.findOne({username:username},function(err, doc){
//         if(doc){
//             return res.json({code:1, msg:'ale'})
//         }
//         //注册后存储cookie model.save 获得id
//         const userModel = new User({username, password:md5Pwd(password)})
//         userModel.save(function(e, d){
//             if(e){
//                 return res.json({code:1, msg:'后端出错了'})
//             }
//             const {username, _id} = d
//             res.cookie('_id', _id)
//             //创建好友表，添加注册者的 _id
//             Contact.create({user_id: _id})
//             return res.json({code:0, data:{username, _id}})
//         })
//     })
// })