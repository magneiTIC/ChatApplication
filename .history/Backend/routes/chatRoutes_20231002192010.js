const express=('express')
const ChatCtrl=('../controllers/chatCtrl')
const router = express.Router()

router.post("/",ChatCtrl.createChat);

router.get("/chatId",ChatCtrl.getChatsByChat)
 

module.exports=router;