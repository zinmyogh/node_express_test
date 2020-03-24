module.exports = options => {
  const jwt = require('jsonwebtoken'),
  plugin = require('../plugin/main'),
  User = require('../models/User');

  return async(req, res, next) => {
    try{
      const token = String(req.headers.authorization || '').split(' ').pop();
      if(!token){
        return res.status(401).send({message:'please give me token'})
      }
      const { id } = jwt.verify(token, plugin.secret)
      if(!id){
        return res.status(401).send({message:'please give me id'})
      }
      req.user = await User.findById(id)
      if(!req.user){
        return res.status(401).send({message:'please login first'})
      }
      await next()
    }catch(err){
      res.send({err: err})
    }
  }
 }


//5.API路由处理 拦截验证JWT
//  localhost:端口号/api 路径路由定义
// var apiRoutes = express.Router();
// return async (req, res, next)  => {
//     // 拿取token 数据 按照自己传递方式写
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (token) {      
//         // 解码 token (验证 secret 和检查有效期（exp）)
//         jwt.verify(token, app.get('secret'), function(err, decoded) {      
//               if (err) {
//             return res.json({ success: false, message: '无效的token.' });    
//               } else {
//                 // 如果验证通过，在req中写入解密结果
//                 req.decoded = decoded;  
//                 console.log(decoded)  ;
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
//     }
//     // 6.JWT验证后操作
// //API跟路径返回内容
// apiRoutes.get('/', function(req, res) {
//   res.json({ message: req.decoded._doc.name+'  欢迎使用API' });
// });
  // }
