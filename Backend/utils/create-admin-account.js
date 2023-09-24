const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Informations de l'administrateur
const adminInfo = {
  email: 'adn@admin.test',
  password: 's3cure',
  displayName: 'Administrateur',
};

async function createAdmin() {
  try {
    // Utilisez Firebase Authentication pour créer le compte administrateur
    await admin.auth().createUser({
      email: adminInfo.email,
      password: adminInfo.password,
      displayName: adminInfo.displayName,
    })
      .then(() => {
        console.log('Compte administrateur créé avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la création du compte administrateur', error);
      });
  } catch (error) {
    console.error(error);
  }
}

createAdmin()