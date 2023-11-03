const express=require('express')
const ChatCtrl=require('../controllers/chatCtrl')
const router = express.Router()
const { uploadFileMiddleware } = require('../controllers/upload');

router.post("/",ChatCtrl.createChat);

router.get("/:uid",ChatCtrl.getChatsByUser)
 
router.post("/addMessage/:chatId", ChatCtrl.addMessageToChat);
router.post("/addMedia/:chatId",uploadFileMiddleware, ChatCtrl.addMediaToChat);

module.exports=router;