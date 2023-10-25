const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminCtrl');
// const checkAuth = require('../middleware/middleware')
// const userCtrl = require("../controllers/userCtrl");

router.post("/create-user", adminCtrl.createUser);

router.get("/directeurs", adminCtrl.getAllDirectors);

router.get("/agents", adminCtrl.getAllAgents);

// Route pour récupérer toutes les divisions
router.get("/divisions", adminCtrl.getAllDivisions);





// Route pour créer un nouveau compte utilisateur par l'administrateur
// router.post('/create-user', checkAuth, (req, res) => {
//     if(req.isAdmin){
//         adminCtrl.createUser;
//     } else {
//         res.status(403).json({ message: 'Accès interdit' });
//     }
// });



// router.post("inforAdmin", adminCtrl.)




// Route pour afficher l'ensemble des utilisateurs avec leur info (email,username,date de dernière de connexion,statut,device)

module.exports = router;
