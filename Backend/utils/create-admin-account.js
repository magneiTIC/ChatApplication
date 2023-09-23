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
  role: 'admin' // Attribut personnalisé
};

async function createAdmin() {
  try {
    // Utilisez Firebase Authentication pour créer le compte administrateur
    const userRecord = await admin.auth().createUser({
      email: adminInfo.email,
      password: adminInfo.password,
      displayName: adminInfo.displayName,
    })
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: adminInfo.role })
      .then(() => {
        console.log('Compte administrateur créé avec succès', userRecord.uid);
      })
      .catch((error) => {
        console.error('Erreur lors de la création du compte administrateur', error);
      });
  } catch (error) {
    console.error(error);
  }
}

createAdmin()