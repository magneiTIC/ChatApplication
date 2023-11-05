const admin = require('firebase-admin');
const User = require('../models/user') ;

async function checkAuth(req, res, next) {
  try {
    const firebaseToken = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const uid = decodedToken.uid;
    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(403).json({ message: "Utilisateur non trouvé dans la base de données." });
    }
    const userProfile = user.profile;
    const path = req.path;
    if (path.startsWith('/admin') && userProfile === "ADMIN") {
      // Seuls les utilisateurs avec le rôle "ADMIN" ont accès aux routes d'administrateur
      next();
    } else if (path.startsWith('/users') && (userProfile === "AGENT" || userProfile === "DIRECTEUR")) {
      // Seuls les utilisateurs avec le rôle "AGENT" ou "DIRECTEUR" ont accès aux routes utilisateur
      next();
    } else {
      return res.status(403).json({ message: "Non autorisé, rôle d'utilisateur invalide pour cette route." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé, token Firebase invalide." });
  }
}


// async function checkUserProfile(req, res, next) {
//   const uid = req.params.uid;
//   try {
//       // Recherchez le profil de l'utilisateur en fonction de l'UID
//       const userProfile = await User.findOne({ uid });
  
//       if (userProfile) {
//         // Renvoie le profil de l'utilisateur
//         res.json({ profile: userProfile.profile });
//       } else {
//         // L'utilisateur n'existe pas
//         res.status(404).json({ error: 'Utilisateur non trouvé' });
//       }
//     } catch (error) {
//       console.error('Erreur lors de la vérification du profil :', error);
//       res.status(500).json({ error: 'Erreur serveur' });
//     }
// }

module.exports = checkAuth;