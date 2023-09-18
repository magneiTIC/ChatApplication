const pusher= require('pusher');
const express = require('express');
const routes = express.Router()

// routes.post('/api/messages',handlers:async (req, res) => {
//      await pusher.trigger( "my-channel", "chat", {
//       username: req.body.username,
//       message: req.body.message });
//  return  res.json(body,[]);

// })

module.exports = routes