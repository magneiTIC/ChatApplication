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

    // Vérifiez le mot de passe ici en comparant le mot de passe fourni avec le mot de passe enregistré dans Firebase
    // Vous pouvez utiliser une bibliothèque de hachage de mot de passe, par exemple bcrypt, pour comparer les mots de passe de manière sécurisée
    const isPasswordValid = await comparePasswords(password, userRecord.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Si la vérification du mot de passe réussit, continuez ici

    // Vérification du rôle de l'utilisateur
    const role = userRecord.displayName;

    console.log('uid:', userRecord.uid);
    console.log('role', role);

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

    // Gestion d'autres erreurs
    return res.status(500).json({ message: "Erreur d'authentification." });
  }
}

};
