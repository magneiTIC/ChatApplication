const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const User = require('../models/user'); // Modèle MongoDB pour les utilisateurs
const admin = require('firebase-admin')

module.exports = {

    

}
// Fonction pour générer un mot de passe aléatoire
function generateRandomPassword() {
    // Générez un mot de passe aléatoire de 8 caractères (vous pouvez ajuster la longueur selon vos besoins)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}
