// const io = require('socket.io');
exports = module.exports = function (io) {

  io.on('connection', function(socket) {
    // let handshake = socket.handshake;
    console.log('a user connect :D'+socket.id);
  
    socket.emit('socket id', socket.id);
  
    socket.on('chat message', msg => {
      console.log('Socket id from Client: ' + msg.avator);
      console.log('Message from a user: ' + msg.msg);
      socket.broadcast.emit('getMsgFromServer', msg);
    });
  
    // 当关闭连接后触发 disconnect 事件
    socket.on('disconnect', () => {
      console.log('a user disconnect :(');
    });
  });
}

//   // Set socket.io listeners.
//   io.on('connection', (socket) => {
//     console.log('a user connected');

//     // On conversation entry, join broadcast channel
//     socket.on('enter conversation', (conversation) => {
//       socket.join(conversation);
//       // console.log('joined ' + conversation);
//     });

//     socket.on('leave conversation', (conversation) => {
//       socket.leave(conversation);
//       // console.log('left ' + conversation);
//     });

//     socket.on('new message', (conversation) => {
//       io.sockets.in(conversation).emit('refresh messages', conversation);
//     });

//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
// };

// /////////////////////////////////////////////////////////////////////////////////////////
// // 通过 emit 和 on 可以实现服务器与客户端之间的双向通信
// var arrAllSocket = [];
// const users = {};
// // io.sockets.on('connection', function (socket) { ... }) 的作用是服务器监听所有客户端 并返回该新连接对象
// // 这个事件在在客户端与服务器建立链接时自动触发
// io.on('connection', function (socket) {
//     console.log('新加入一个连接。');
//     socket.on('join',  (userName) => {
//         console.log(userName)
//         // let username = JSON.parse(userName.toString());
//         // console.log(username)
//         let user = userName;
//         // console.log(user)
//         arrAllSocket[user] = socket;//把socket存到全局数组里面去
//         console.log(arrAllSocket[user])
// 	});
 
// 	//私聊：服务器接受到私聊信息，发送给目标用户
// 	socket.on('private_message',  (from,to,msg) =>{
//         var target = arrAllSocket[to];
// 		if(target)
// 		{
// 			// console.log('emitting private message by ', from, ' say to ',to, msg);
// 			target.emit("pmsg",from,to,msg);
// 		}
// 	});
//     //determine user is online or offline
//     socket.on('login', function(data){
//         console.log('a user ' + data.userId + ' connected');
//         // saving userId to array with socket ID
//         users[socket.id] = data.userId;
//         console.log("data.userId .... . ....   "+data.userId);
//         console.log("user[socket.id] .... . ....   "+users[socket.id])
//         console.log("data ....   "+ data)
//       });
//       socket.on('disconnect', function(){
//         console.log('user ' + users[socket.id] + ' disconnected');
//         // remove saved socket from users object
//         delete users[socket.id];
//       });
//     // 当关闭连接后触发 disconnect 事件
//     // socket.on('disconnect', () => {
//     //     console.log('断开一个连接。');
//     // });
// });

//////////////////////////////////////////////////////////////////////////////////////
    //监听connection事件
//     var userCount = 0;
//     io.on('connection', (socket) => {
//     userCount ++;
//     console.log('client connected count: ', userCount)
//     socket.on('message', (data) => {
//         console.log(data);
//         let {sender, reciever, message} = JSON.parse(data.toString());
//         console.log(sender, reciever, message)
//         Chatting.create({sender, reciever, message}, function(err, doc){ //数据库存入数据
//             console.log(doc.message_time)
//         // io.emit('recvmsg', Object.assign({}, doc._doc))
//         let data = JSON.stringify({message: doc.message, message_time: doc.message_time})
//         socket.emit('recvmsg', data)
//         })
//         socket.on('disconnect', () => {
//             userCount--;
//             console.log('client connected count: ', userCount)
//         })
//     })
// })
/////////////////////////////////////////////////////////////////////////////////////////
//Test socket connect with private message chat
//socket namespace and rooms
// const gameRooms = ["RL", "ML", "LOL"]

// io.of("/games").on("connection", (socket) => {
//     console.log(socket.id)
//     socket.emit("welcome", "Hello, welcome to the Game Area!");

//     socket.on("joinRoom", (room) => {
//         if(gameRooms.includes(room)){
//             socket.join(room);
//             io.of("/games").in(room).emit("newUser", "new Player has join to the "+ room)
//             return socket.emit("success", "You have successfully joined this Room ")
//         }else{
//             return socket.emit("err", "ERROR: NO ROOM! NAME: " + room);
//         }
//     })
// })
////////////////////////////////////////////////////////////////////////////////////////
// var users = [];
// io.sockets.on('connection',(socket)=>{
//     // 失去连接
//     socket.on('disconnect',function(){
//       if(users.indexOf(socket.username)>-1){
//          users.splice(users.indexOf(socket.username),1);
//          console.log(socket.username+'===>disconnected');
//       }
  
//         socket.broadcast.emit('users',{number:users.length});
//     });
  
//     socket.on('message',function(data){
//       let newData = {text: data.text, user: socket.username}
//       socket.emit('receive_message',newData);
//       socket.broadcast.emit('receive_message',newData);
//     });
  
  
//     socket.on('login',function(data){
//       if(users.indexOf(data.username)>-1){
  
//       }else{
//         socket.username = data.username;
//         users.push(data.username);
//         // 统计连接数
//         socket.emit('users',{number:users.length});  // 发送给自己
//         socket.broadcast.emit('users',{number:users.length}); // 发送给其他人
//       }
//     });
  
//   });








// // Client Code

// var socket = io.connect('http://something.com:3300/');
// function sendMessage(message) {
// socket.emit('message', message);    
// }
// // Server Code

// var io = require('socket.io').listen(3300);

// io.sockets.on('connection', function (socket) {
//   messageHandler(socket);
// });

// function messageHandler(socket) {
//     socket.on('message', function (data) {	
// 	  console.log('Captured a message : ' + data);	
//     });
// }