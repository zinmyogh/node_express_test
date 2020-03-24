const io = require("socket.io-client");

// let games = io.connect("http://localhost:3000/games");

// games.on("welcome", (msg) => {
//   console.log("Received: ", msg)
// })

// games.emit("joinRoom", "ML");

// games.on("newUser", (res) => {console.log(res)});

// games.on("err", (err) => {
//   console.log(err)
// })
// games.on("success", (res) => {console.log(res)});

////////////////////////////////////////////////////////
let client = io.connect("http://localhost:3000");
// var data = JSON.stringify({sender: 'zinn',to: 'heee', message: "hi, how are you. Heee!"})
let userName = "zinn";
let from = "zinn";
let to = "heee";
let msg = " u  you heee heee heee";
client.emit('join', (userName) )
setInterval(() => {
  client.emit("private_message",from,to,msg);
}, 10000)

// 监听私聊消息
client.on('pmsg', (from,to,msg) => {
  console.log("get private message...from:  "+from +"  to:  "+to +"  msg:  "+msg);
});

