var app = require('express')(); // 获取express模块实例
var http = require('http').Server(app); // 将express模块实例作为回调构建http模块实例
var io = require('socket.io')(http); // 将http模块实例作为回调构建socket.io模块实例

// 使用http模块开启后端服务（原生node+express的结合）
http.listen(3000, function () {
    console.log('listening on http://127.0.0.1:3000')
})
// 设置路由，构建后端接口
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/test.html'); // 将根目录下的index.html发送到前端
})
var users = {}; // 保存所有用户的键值对集合
io.on('connection', function (socket) {
    console.log(socket.id)
    socket.on('con', function (msg) {
        var obj = JSON.parse(msg) // 获取连接的用户信息
        users[obj.username] = socket.id; // 将当前用户名和对应的链接id进行保存
        console.log('有新的链接,最新用户集合为：', users)
    })
    // 接收客户端发来的数据
    socket.on('chat message', function (msg) {
        var obj = JSON.parse(msg) // 获取连接的用户信息
        console.log('obj:', obj)
        if (users[obj.toWho] == undefined) {
            let respmes = {
                usernamez: '系统信息',
                mes: '抱歉【' + obj.toWho + '】还未上线'
            }
            io.to(socket.id).emit('receiveMessage', JSON.stringify(respmes)); // 将消息发给当前用户
        } else { // 说明目标用户存在
            let respmes = {
                usernamez: obj.username,
                mes: obj.mes
            }
            io.to(users[obj.toWho]).emit('receiveMessage', JSON.stringify(respmes)); // 通过id将信息转发给指定的对象
        }
    })
    // 如果是断开socket请求，就会触发下面的代码
    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
})