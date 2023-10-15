const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const checkAuth = require("../middleware/middleware");
const router = express.Router();

// Route pour se connecter en tant que utilisateur
router.post("/isProfileConfigured", userCtrl.isProfileConfigured);
// Route pour mettre à jour le compte de l'utilisateur
router.post("/register", userCtrl.register);


module.exports = router;