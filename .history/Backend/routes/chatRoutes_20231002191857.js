const express=('express')
const ChatCtrl=('../controllers/chatCtrl')
const router = express.Router()

router.post("/",MessageCtrl.createMessage);

router.get("/chatId",MessageCtrl.getMessagesByChat)
 

module.exports=router;