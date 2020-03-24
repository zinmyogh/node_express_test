// const io = require("socket.io-client");

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
// let client = io.connect("http://localhost:3000");
// client.emit('login',{userId:'zinn13230'});

var http 		= require('http')

var redis 		= require('redis')
var client 		= redis.createClient()


module.exports = (app) => {
	const server 	= http.createServer(app)
	const io 		= require('socket.io').listen(server)

	io.sockets.on('connection', (socket) => {
		socket.on('sendChat', (user, msg, messageId) => {
			client.get(user, function(err, socketId){
				io.to(socketId).emit('updateChat', socket.username, msg, messageId)
			})
	  	})
		socket.on('delivered', (user, messageId) => {
			client.get(user, function(err, socketId){
				io.to(socketId).emit('delivered', messageId)
			})
		})
		socket.on('seen', (user, messageId) => {
			client.get(user, function(err, socketId){
				io.to(socketId).emit('seen', messageId)
			})
		})
		socket.on('adduser', (username) => {
			client.set(username, socket.id, function(err){
				socket.username = username
				io.sockets.emit('updateOnlineUser', username)
			})
		})
		socket.on('disconnect', function(){
			client.del(socket.username)
			io.sockets.emit('updateOfflineUser', socket.username)
		})
	})
}