const User = require('../models/user');

// const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
// const admin = require('firebase-admin');
// const jwt = require('jsonwebtoken');


module.exports = {

    async createUser(req, res) {
        const { email, division, profile } = req.body;
        const motDePasseParDefaut = 'passer';
        try {
            // Créez un profil utilisateur dans la base de données MongoDB avec les données nécessaires
            const user = new User({ email, division, profile, password: motDePasseParDefaut, isConfigured: false });
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

    async getAllDirectors(req, res) {
        User.find({ profile: 'Directeur' })
            .then(directeurs => {
                res.json(directeurs);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des Directeurs' });
            });
    },

    async getAllAgents(req, res) {
        User.find({ profile: 'Agent' })
            .then(agents => {
                res.json(agents);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des Agents' });
            });
    },

    async getAllDivisions(req, res) {
        try {
            const divisions = await User.distinct('division').exec();
            res.json(divisions);
        } catch (error) {
            throw new Error('Erreur lors de la récupération des divisions : ' + error);
        }
    }

}

