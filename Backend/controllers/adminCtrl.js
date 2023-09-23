const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const User = require('../models/User'); // Modèle MongoDB pour les utilisateurs
const admin = require('firebase-admin')

module.exports = {

    async createUser(req, res) {
        try {
            // Récupérez les données du formulaire d'inscription
            const { email, username } = req.body;

            // Générez un mot de passe par défaut (par exemple, une chaîne aléatoire)
            const defaultPassword = generateRandomPassword();

            // Hachez le mot de passe
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);

            // Créez un nouvel utilisateur
            const newUser = new User({
                email,
                username,
                password: hashedPassword, // Stockez le mot de passe haché dans la base de données
            });

            // Créer un compte utilisateur avec Firebase Authentication
            await admin.auth().createUser({ newUser });

            // Enregistrez le nouvel utilisateur dans la base de données MongoDB
            await User.create(newUser);

            res.status(201).json({ message: 'Compte utilisateur créé avec succès', defaultPassword });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la création du compte utilisateur' });
        }
    }

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
