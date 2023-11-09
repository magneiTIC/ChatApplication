const admin = require('firebase-admin');
const User = require("../models/user");
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminInfo = {
  email: 'adn@admin.test',
  password: 's3cure',
  profile: 'ADMIN',
  username: 'admin',
};

async function createAdmin() {
  try {
    const user = await admin.auth().createUser({
      email: adminInfo.email,
      password: adminInfo.password,
    });
    const adminUser = new User({
      username: adminInfo.username, 
      profile: adminInfo.profile,
      uid: user.uid, 
    });
    await adminUser.save();
    console.log('Compte administrateur créé avec succès', user.getIdToken());
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur', error);
  }
}

createAdmin();
