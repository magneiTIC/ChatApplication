const express=require('express')
const ChatCtrl=require('../controllers/chatCtrl')
const router = express.Router()
const { uploadFileMiddleware } = require('../controllers/upload');

router.post("/",ChatCtrl.createChat);

router.get("/:uid",ChatCtrl.getChatsByUser)
 
router.post("/addMessage/:chatId",uploadFileMiddleware, ChatCtrl.addMessageToChat);

module.exports=router;