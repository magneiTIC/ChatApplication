const admin = require('firebase-admin');


async function checkAuth(req, res, next) {
  
  // Récupérez le token JWT depuis les en-têtes de la requête
  const idToken = req.header('Authorization').split('Bearer ')[1]; // Extrait le jeton d'identification de l'en-tête
  if (!idToken) {
    console.log('Pas de token !!!!!!!!')
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Stockez les informations de l'utilisateur dans req.user
    req.user = decodedToken;
    if (decodedToken.role === 'admin') {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
    }
    console.log("decodedToken", JSON.stringify(decodedToken));
    res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email };
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json({ message: 'Token is invalid or expired' });
  }
}

module.exports = checkAuth;
