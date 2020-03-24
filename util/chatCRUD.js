'use strict';

const mongoose = require('mongoose'),
Chat = mongoose.model('Chat');

exports.list_all_chats = function(req, res) {
  Chat.find({}, function (err, chat){
    if(err)
      res.send(err);
    res.json(chat);
  });
};

exports.create_a_chat = function(req, res){
  let new_chat = new Chat(req.body);
  new_chat.save(function(err, chat){
    if(err)
      res.send(err);
    res.json(chat);
  });
};

exports.read_a_chat = function(req, res){
  Chat.findById(req.params.chatId, function(err, chat){
    if(err)
      res.send(err);
    res.josn(chat);
  });
};

exports.update_a_chat = function(req, res){
  Chat.findOneAndUpdate({_id: req.params.chatId}, req.body, {new: true}, function(err, chat){
    if(err)
      res.send(err);
    res.json(chat);
  });
};

exports.delete_a_chat = function(req, res){
  Chat.remove({
    _id: req.params.chatId
  }, function(err, chat){
    if(err)
      res.send(err);
    res.json({message: 'Chat message successfully deleted.'});
  });
};