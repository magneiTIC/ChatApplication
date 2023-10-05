const admin = require('firebase-admin');

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

module.exports = checkAuth ;