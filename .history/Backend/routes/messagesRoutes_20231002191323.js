const express= require('express')
const MessageCtrl=require('../controllers/messageCtrl')
var router = express.Router();

router.post("/",MessageCtrl.createMessage);

router
