const mongoose = require ('mongoose')
const User = require ('./user') 
const chatSchema = new mongoose.Schema({
    users:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
})