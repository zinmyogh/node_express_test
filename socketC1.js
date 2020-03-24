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
// var data = JSON.stringify({sender: 'heee', to: 'zinn', message: "hi, how are you. Zinn!"})
let userName = "heee";
let from = "heee";
let to = "zinn";
let msg = "my name is heee, you zinn";
client.emit('join', (userName) )
setInterval(()=> {
  client.emit("private_message",from,to,msg);
}, 12000)


// 监听私聊消息
client.on('pmsg', (from,to,msg) => {
  console.log("get private message...from:  "+from +"  to:  "+to +"  msg:  "+msg);
});

