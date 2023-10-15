const mongoose = require ('mongoose')
const chatSchema = new mongoose.Schema({
    users:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    messages:[
        {
            type : mongoose.Schema.ObjectId,
            ref:'Message'
        }
    ],
    
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const Chat= mongoose.model('Chat',chatSchema)