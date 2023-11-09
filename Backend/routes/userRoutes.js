const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const middleware = require("../middleware/middleware");
const router = express.Router();

// Route pour se connecter en tant que utilisateur
router.post("/isProfileConfigured", userCtrl.isProfileConfigured);
// Route pour mettre à jour le compte de l'utilisateur
router.post("/register", userCtrl.register);
// Route pour récupérer les utilisateurs d'une division spécifique
router.get("/:uid/same-division",userCtrl.getAllUsersInSameDivision)
//route pour recuperer l'id de l'utilisateur courant
router.get("/:uid",userCtrl.getUserIdByUid)
//route pour récupérer le statut de l'utilisateur
router.post("/:uid/setUserStatus", userCtrl.setUserStatus)
//route pour avoir la liste des contacts de la meme division d'un utilisateur
router.get('/contacts/:uid', userCtrl.listContactsInSameDivision)
//route pour avoir la liste des contacts des autres divisoons d'un meme utilisateur 
router.get('/contactsByDivision/:uid',userCtrl.contactsByDivision)
//route pour avoir les autres divisions 
router.get('/groups/:uid',userCtrl.getDivisionByUser)
//route pour récupérer le profil de l'utilisateur
router.get("/:uid/checkUserProfile", middleware.checkUserProfile);

module.exports = router;