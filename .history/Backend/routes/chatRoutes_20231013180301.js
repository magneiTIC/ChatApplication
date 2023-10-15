const express=require('express')
const ChatCtrl=require('../controllers/chatCtrl')
const router = express.Router()

// router.post("/",ChatCtrl.createChat);

router.get("/:uid",ChatCtrl.getChatsByUser)
 
router.post("/addMessage", ChatCtrl.addMessageToChat);

module.exports=router;