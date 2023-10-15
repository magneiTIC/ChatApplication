const admin = require('firebase-admin');
const UserModel = require("../models/user");
// const jwt = require('jsonwebtoken');
// require("dotenv").config();



module.exports = {

  async isProfileConfigured(req, res) {
    try {
      const email = req.body.email;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      } else {
        const checkUsername = user.username;
        if (!checkUsername) {
          res.json({ message: "Le profil n'est pas encore configuré", isProfileConfigured: false });
        } else {
          res.status(200).json({ message: "Profil déjà configuré" });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil :', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du profil' });
    }
  },

  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      // Creez un compte sur firebase
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        // displayName: displayName,
      }); const userUID = userRecord.uid;
      // Mettez à jour le profil de l'utilisateur dans MongoDB
      await UserModel.findOneAndUpdate(
        { email: email }, { username: username, uid: userUID }
      );
      // Réponse de succès
      res.status(200).json({ message: 'Inscription terminée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la tentative de terminer l\'inscription :', error);
      // Gérez les erreurs ici
      res.status(500).json({ message: 'Erreur lors de la tentative de terminer l\'inscription' });
    }
  },
  
  async getAllUsersInSameDivision(req, res) {
    try {
      const uid = req.params.uid;
      // Recherchez l'utilisateur en fonction de son ID pour obtenir sa division
      const user = await UserModel.findOne({ uid });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      const division = user.division;
      // Utilisez la méthode find() de Mongoose pour rechercher les utilisateurs de la même division
      const users = await UserModel.find({ division, uid: { $ne: uid } });
      if (users.length === 0) {
        return res.status(404).json({ message: "Aucun utilisateur trouvé dans la même division." });
      }
      res.json(user);
    }
    catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },
}

// const generateToken = (userId) => {
//   const token = jwt.sign({ userId }, tokenKey, { expiresIn: '1h' }); // Vous pouvez définir une durée d'expiration appropriée
//   return token;
// };

