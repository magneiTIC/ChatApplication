const userCtrl = require("../controllers/userCtrl");

const router = require("express").Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);


module.exports = router;