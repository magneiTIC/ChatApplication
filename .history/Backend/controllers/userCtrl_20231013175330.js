const admin = require('firebase-admin');
const UserModel = require("../models/");
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const tokenKey = process.env.TOKEN_KEY;
const iv = "IV_VALUE"; // Remplacez par la valeur de l'IV réelle


module.exports = {

  async isProfileConfigured(req, res) {
    try {
        const email = req.body.email;
        console.log("email", email);
        const username = req.body.username;
        const user = await UserModel.findOne({ email: email }); // Utilisez "await" pour attendre la résolution de la promesse
        const checkUsername = await UserModel.findOne({ username: username }); // Utilisez "await" pour attendre la résolution de la promesse
        
        // if (!user) {
        //     return res.status(404).json({ message: "Utilisateur introuvable." });
        // }

        if (!user || !checkUsername) {
          
            res.json({ message: "Le profil n'est pas encore configuré", isProfileConfigured: false });
        } else {
          console.log("email 2",user.email)
          console.log("username",checkUsername.username)
            res.status(200).json({ message: "Profil déjà configuré" });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du profil :', error);
        res.status(500).json({ message: 'Erreur lors de la vérification du profil' });
    }
},


  async register(req, res) {
    const { username, uid, email } = req.body;
    try {      
      // Mettez à jour le profil de l'utilisateur dans MongoDB
      await UserModel.findOneAndUpdate(
        { email: email }, { username: username, uid: uid }
      );
      // Réponse de succès
      res.status(200).json({ message: 'Inscription terminée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la tentative de terminer l\'inscription :', error);
      // Gérez les erreurs ici
      res.status(500).json({ message: 'Erreur lors de la tentative de terminer l\'inscription' });
    }
  },
  async getAllUsers(req,res){
    try {
      const users = await UserModel.find(); // Récupérez tous les utilisateurs depuis la base de données
      res.json(users); // Répondez avec la liste des utilisateurs au format JSON
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  }
};

// const generateToken = (userId) => {
//   const token = jwt.sign({ userId }, tokenKey, { expiresIn: '1h' }); // Vous pouvez définir une durée d'expiration appropriée
//   return token;
// };

