const admin = require('firebase-admin');

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Utilisez Firebase Authentication pour vérifier les informations d'identification
      const userRecord = await admin.auth().getUserByEmail(email);
  
      // Si l'utilisateur n'existe pas, renvoyez une réponse indiquant que l'authentification a échoué
      if (!userRecord) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }
  
      // Vérification du rôle de l'utilisateur
      const role = userRecord.displayName;
  
      console.log('uid:', userRecord.uid);
      console.log('role', role);
  
      // Ici, vous pouvez ajouter la vérification du mot de passe si nécessaire
      // Par exemple, utilisez Firebase Authentication pour vérifier le mot de passe
  
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
  
      // Si une erreur Firebase Authentication survient (par exemple, mot de passe incorrect), renvoyez une réponse appropriée
      if (error.code === 'auth/wrong-password') {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }
  
      // Gestion d'autres erreurs
      return res.status(500).json({ message: "Erreur d'authentification." });
    }
  }
  
};
