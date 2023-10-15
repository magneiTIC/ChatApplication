const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const User = require('../models/user'); // Modèle MongoDB pour les utilisateurs
const admin = require('firebase-admin')

module.exports = {

    async register(req, res) {
        try {
            // Récupérez les données du formulaire d'inscription
            const { email, username } = req.body;
    
            // Générez un mot de passe par défaut (par exemple, une chaîne aléatoire)
            const defaultPassword = generateRandomPassword();
            console.log("defaultPassword",defaultPassword);

    
            // Hachez le mot de passe
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            
    
            // Créez l'utilisateur dans Firebase Authentication
            const userRecord = await admin.auth().createUser({
                email,
                password: defaultPassword, // Utilisez le mot de passe par défaut ici si nécessaire
            });
    
            // Récupérez l'UID généré par Firebase
            const uid = userRecord.uid;
    
            // Enregistrez l'utilisateur dans MongoDB avec l'UID de Firebase
            await User.create({
                email,
                username,
                uid, 
                
            });
    
            // Répondez avec succès
            res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de l'inscription" });
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
