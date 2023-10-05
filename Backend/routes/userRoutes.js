const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const checkAuth = require("../middleware/middleware");
const router = express.Router();

// Route pour se connecter en tant que admin ou user simple
// router.post("/login", userCtrl.login);

// Route pour changer de mdp à la première connexion
router.get("/change-password", checkAuth, (req, res) => {
    res.send('Page de changement de mot de passe');
});

// Route pour afficher l'ensemble des users(username,avatar,statut,date de dernière connexion)

module.exports = router;