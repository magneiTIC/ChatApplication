const express=require('express')
const ChatCtrl=require('../controllers/chatCtrl')
const router = express.Router()

router.post("/",ChatCtrl.createChat);

router.get("/chatId",ChatCtrl.getChatsByUser)
 
router.post("/addMessage", Ctrl.addMessageToChat);

module.exports=router;