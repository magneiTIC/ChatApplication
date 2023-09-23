const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminCtrl');
const checkAuth = require('../middleware/middleware')
const userCtrl = require("../controllers/userCtrl");


// Route pour créer un nouveau compte utilisateur par l'administrateur
router.post('/create-user', checkAuth, (req, res) => {
    if(req.isAdmin){
        adminCtrl.createUser;
    } else {
        res.status(403).json({ message: 'Accès interdit' });
    }
});

router.post("/login", userCtrl.login);




// Route pour afficher l'ensemble des utilisateurs avec leur info (email,username,date de dernière de connexion,statut,device)

module.exports = router;
