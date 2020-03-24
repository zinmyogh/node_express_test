'use strict';
const express = require("express"),
    bodyParser = require('body-parser'),
    path = require('path'),
    plugin = require('./plugin/main'),
    authMiddle = require('./middleware/auth'),
    resourceMiddle = require('./middleware/resource'),
    socket = require('./common/socket'),
    userRouter = require('./routes/chat/user'),
    cors = require('cors'),

app = express(),

//work with express
server = require('http').createServer(app), //express server 用http包裹
io = require('socket.io')(server);  //再传给socket.io对象，使其与express关联起来
socket(io);

// var redis = require('redis');
// var client = redis.createClient(6379);

// client.set('key', 'hahahah', function(err, reply) {
//     if (err) {
//         console.log(err);
//         return;
//     }   
//     client.get('key', function(err, reply) {
//         if (err) {
//             console.log(err);
//             return;
//         }   
//         console.log(reply);
//         client.quit();
//     }); 
// });
//开启中间件
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //解析post 传来的json数据
app.use(cors());
app.use(express.json());
app.use('/user/:resource', authMiddle(), resourceMiddle(), userRouter);
app.use('/statics', express.static(path.join(__dirname, 'public')));

require('./plugin/db')(app);
require('./routes/api')(app);

server.listen(plugin.port, plugin.address, () => {
    console.log(server.address());
})