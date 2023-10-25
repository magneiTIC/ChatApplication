const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const checkAuth = require("../middleware/middleware");
const router = express.Router();

// Route pour se connecter en tant que utilisateur
router.post("/isProfileConfigured", userCtrl.isProfileConfigured);
// Route pour mettre à jour le compte de l'utilisateur
router.post("/register", userCtrl.register);
// Route pour récupérer les utilisateurs d'une division spécifique
router.get("/:uid/same-division",userCtrl.getAllUsersInSameDivision)
//route pour recuperer l'id de l'utilisateur courant
router.get("/:uid",userCtrl.getUserIdByUid)

router.post("/:uid/setUserStatus", userCtrl.setUserStatus)

module.exports = router;