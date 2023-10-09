const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const UserModel = require('../models/user'); // Modèle MongoDB pour les utilisateurs
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');


module.exports = {
    async createUser(req, res) {
        const { email, division } = req.body;
        const motDePasseParDefaut = 'passer';
        try {
            // Créez un profil utilisateur dans la base de données MongoDB avec les données nécessaires
            const user = new UserModel({ email, division, password: motDePasseParDefaut, isConfigured: false });
            // Enregistrez l'utilisateur dans la base de données MongoDB
            await user.save();
            // Réponse de succès
            res.status(201).json({ message: 'Inscription de l\'utilisateur commencée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la tentative de début d\'inscription :', error);
            // Gérez les erreurs ici
            res.status(500).json({ message: 'Erreur lors de la tentative de début d\'inscription' });
        }
    },

   
}

