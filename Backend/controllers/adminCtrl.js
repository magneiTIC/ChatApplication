const User = require('../models/user');
const EncryptionKey = require('../models/encryption-key');
const { getSecretKey } = require('../config/generate-key')
// const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
// const admin = require('firebase-admin');
// const jwt = require('jsonwebtoken');


module.exports = {

    async createUser(req, res) {
        const { email, division, profile } = req.body;
        const motDePasseParDefaut = 'passer';
        let defaultValue = (Math.random() + 1).toString(36).substring(7);
        try {
            const user = new User({
                email,
                division,
                profile,
                password: motDePasseParDefaut,
                username: defaultValue,
                uid: defaultValue,
                isConfigured: false,
            });
            await user.save();
            const { publicKey, encryptedPrivateKey } = await getSecretKey();
            const encryptionKey = new EncryptionKey({
                userId: user._id,
                privateKey: encryptedPrivateKey,
                publicKey: publicKey,
            });
            await encryptionKey.save();
            const userProfile = user.profile;
            res.status(201).json({ message: 'Inscription de l\'utilisateur commencée avec succès', userProfile: userProfile });
        } catch (error) {
            console.error('Erreur lors de la tentative de début d\'inscription :', error);
            res.status(500).json({ message: 'Erreur lors de la tentative de début d\'inscription' });
        }
    },

    async getAgentByUID(req, res) {
        try {
            const uid = req.params.uid;
            const user = await User.findOne({ uid: uid });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur introuvable." });
            } else {
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

    async numberOfDirectors(req, res) {
        const total = await User.countDocuments({ profile: "DIRECTEUR" })
        res.status(200).json(total)

    },

    async numberOfAgents(req, res) {
        const total = await User.countDocuments({ profile: "AGENT" })
        res.json(total)

    },

}

