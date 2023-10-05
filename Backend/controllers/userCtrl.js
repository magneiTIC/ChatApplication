const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

module.exports = {
  async login(req, res) {
    try {
      const email = req.body.email;
      const user = await admin.auth().getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      const profil = user.displayName ? user.displayName : 'USER';

      // Créez le payload pour le jeton JWT
      const payload = {
        uid: user.uid,
        email: user.email,
        profil: profil
      };

      // Signez le jeton JWT
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); 

      return res.json({
        token: token,
        message: `Connexion en tant que ${profil} réussie.`
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur d'authentification." });
    }
  }
};
