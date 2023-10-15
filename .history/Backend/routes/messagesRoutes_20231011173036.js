const express= require('express')
const MessageCtrl=require('../controllers/messageCtrl')
const router = express.Router();

//router.post("/",MessageCtrl.createMessage);

router.get("/:chatId",MessageCtrl.getMessagesByChat)
 

module.exports=router;