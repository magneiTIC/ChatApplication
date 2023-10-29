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
          res.json({isProfileConfigured: false });
        } else {
          res.status(200).json({ isProfileConfigured: true });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil :', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du profil' });
    }
  },

  async register(req, res) {
    const { username, email, password } = req.body
    try {
      // Creer un compte sur firebase
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
      });
      const userUID = userRecord.uid;
      // Mettre à jour le profil de l'utilisateur dans MongoDB
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
      res.json(users);
    }
    catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },

  async getUserIdByUid(req, res) {
    try {
      const uid = req.params.uid;
      const user = await UserModel.findOne({ uid: uid });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      res.status(200).json({ id: user.id });
    } catch (error) {
      console.error("Erreur lors de la recherche de l'ID de l'utilisateur par UID", error);
      res.status(500).json({ error: "Erreur lors de la recherche de l'ID de l'utilisateur par UID" });
    }
  },

  async setUserStatus(req, res) {
    const userId = req.params.uid;
    const newStatus = req.body.status;
    let connectionTime = null;
    let disconnectionTime = null;

    if (newStatus === 'connecté') {
      connectionTime = new Date().toISOString(); // Met à jour l'heure de connexion
    } else if (newStatus === 'déconnecté') {
      disconnectionTime = new Date().toISOString(); // Met à jour l'heure de déconnexion
    }

    try {
      const user = await UserModel.findOneAndUpdate(
        { uid: userId },
        { status: newStatus, connectionTime, disconnectionTime },
        { new: true }
      );

      if (user) {
        res.status(200).json({ message: 'Statut, heure de connexion et heure de déconnexion mis à jour avec succès', user });
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut, de l\'heure de connexion et de l\'heure de déconnexion' });
    }
  },






}

// const generateToken = (userId) => {
//   const token = jwt.sign({ userId }, tokenKey, { expiresIn: '1h' }); // Vous pouvez définir une durée d'expiration appropriée
//   return token;
// };

