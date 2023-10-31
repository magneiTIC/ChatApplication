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
            const userProfile = user.profile;
            res.status(201).json({ message: 'Inscription de l\'utilisateur commencée avec succès', userProfile: userProfile});
        } catch (error) {
            console.error('Erreur lors de la tentative de début d\'inscription :', error);
            // Gérez les erreurs ici
            res.status(500).json({ message: 'Erreur lors de la tentative de début d\'inscription' });
        }
    },
    async getUser(req, res) {
        try {
            const uid = req.params.uid;
            const user = await Users.findOne({ uid:uid });
        
            if (!user) {
              return res.status(404).json({ message: "Utilisateur introuvable." });
            }else{
                res.json(user);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        }
    },
    async getAllDirectors(req, res) {
        try {
            const directeurs = await User.find({ profile: 'DIRECTEUR' });
            res.json(directeurs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des Directeurs' });
        }
    },

    async getAllAgents(req, res) {
        try {
            const agents = await User.find({ profile: 'AGENT' });
            res.json(agents);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des Agents' });
        }
    },

    async getAllDivisions(req, res) {
        try {
            const divisions = await User.distinct('division').exec();
            res.json(divisions);
        } catch (error) {
            throw new Error('Erreur lors de la récupération des divisions : ' + error);
        }
    },
    async numberOfDirectors(req,res){
        const total = await User.countDocuments({ profile: "DIRECTEUR" })
        res.status(200).json(total)
        
    },
    async numberOfAgents(req,res){
        const total = await User.countDocuments({ profile: "AGENT" })
        res.json(total)
        
    },
   


}

