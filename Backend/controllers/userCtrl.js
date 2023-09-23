const admin = require('firebase-admin');


module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Utilisez Firebase Authentication pour vérifier les informations d'identification
      const userRecord = await admin.auth().getUserByEmail(email);
      if (!userRecord) {
        return res.status(400).json({ message: "L'utilisateur n'existe pas." });
      }

      // Vérification du rôle de l'utilisateur
      const role = userRecord.customClaims.role;

      console.log('uid:',userRecord.uid);
      console.log('role', role)

      // Génération du token Firebase
      const customToken = await admin.auth().createCustomToken(userRecord.uid, {
        role: role, // Vous pouvez inclure d'autres informations personnalisées ici si nécessaire
      });

      console.log('Token généré avec succès:', customToken);

      return res.status(200).json({
        message:
          role === 'admin'
            ? "Connexion en tant qu'administrateur réussie."
            : "Connexion en tant qu'utilisateur simple réussie.",
        token: customToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur d'authentification." });
    }
  },
};
