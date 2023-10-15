const admin = require('firebase-admin');

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Utilisez Firebase Authentication pour vérifier les informations d'identification
       const userRecord = await admin.auth().getUserByEmail(email);
      // Utilisez Firebase Authentication pour vérifier les informations d'identification
      //const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);


      if (!userRecord)
        return res.status(400).json({ message: "L'utilisateur n'existe pas." });

      // Vérification du rôle de l'utilisateur
      const role = userRecord.displayName;

      console.log('uid:', userRecord.uid);
      console.log('role', role);

      admin.auth()._verifyAuthBlockingToken
      // Génération du token Firebase
      const token = await admin.auth().createCustomToken(userRecord.uid);

      console.log('Token généré avec succès:', token);

      return res.status(200).json({
        message:
          role === 'Administrateur'
            ? "Connexion en tant qu'administrateur réussie."
            : "Connexion en tant qu'utilisateur simple réussie.",
        token: token,
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/wrong-password') {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      return res.status(500).json({ message: "Erreur d'authentification." });
    }
  },
};
