const admin = require('firebase-admin');


async function checkAuth(req, res, next) {

  // Récupérez le token JWT depuis les en-têtes de la requête
  const idToken = req.header('Authorization')
  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch(() => {
      return res.status(401).json({ message: 'Unauthorized' });
    });
}

module.exports = checkAuth;
