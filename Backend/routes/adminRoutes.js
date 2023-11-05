const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminCtrl');
const checkAuth = require('../middleware/middleware')
// const userCtrl = require("../controllers/userCtrl");

router.post("/create-user" ,adminCtrl.createUser);

router.get("/agent/:uid", adminCtrl.getAgentByUID);

router.get("/directeurs", adminCtrl.getAllDirectors);

router.get("/agents", adminCtrl.getAllAgents);

router.get("/divisions", adminCtrl.getAllDivisions);

router.get("/count-directors", adminCtrl.numberOfDirectors);


router.get("/count-agents", adminCtrl.numberOfAgents);





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
