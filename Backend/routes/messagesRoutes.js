const express= require('express')
const MessageCtrl=require('../controllers/messageCtrl');
const messageCtrl = require('../controllers/messageCtrl');
const router = express.Router();

//router.post("/",MessageCtrl.createMessage);

router.get("/:chatId",MessageCtrl.getMessagesByChat)
 
//route pour obtenir le nombre de messages non lus d'un utilisateur par chat
router.get('/count-unread/:chatId/:userId',messageCtrl.countUnreadMessages)
// router.get("/lastMessage/:chatId",MessageCtrl.getLastMessage)

module.exports=router;