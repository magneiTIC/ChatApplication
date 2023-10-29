const admin = require('firebase-admin');
const User = require('../models/user') 

// Middleware pour vérifier le token d'identification
function checkAuth(req, res, next) {
    const idToken = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (!idToken) {
        return res.status(403).json({ error: 'Aucun token d\'identification fourni.' });
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            next(); // Le token est valide, passez à la route suivante
        })
        .catch((error) => {
            console.error('Erreur de vérification du token d\'identification :', error);
            return res.status(403).json({ error: 'Token d\'identification invalide.' });
        });
}

async function checkUserProfile(req, res, next) {
    const uid = req.params.uid;
    try {
        // Recherchez le profil de l'utilisateur en fonction de l'UID
        const userProfile = await User.findOne({ uid });
    
        if (userProfile) {
          // Renvoie le profil de l'utilisateur
          res.json({ profile: userProfile.profile });
        } else {
          // L'utilisateur n'existe pas
          res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du profil :', error);
        res.status(500).json({ error: 'Erreur serveur' });
      }
}

module.exports = {checkAuth, checkUserProfile} 