const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Vérification username & email
            const usernameCheck = await User.findOne({ username });
            if (usernameCheck)
                return res.status(400).json({ message: "Nom d'utilisateur existe déjà." });

            const emailCheck = await User.findOne({ email });
            if (emailCheck)
                return res.status(400).json({ message: "Email existe déjà." });

            // Hashage password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Création d'un nouvel utilisateur
            await User.create({ username, email, password: hashedPassword });
            res.status(201).json({ message: "Inscription réussie." });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de l'inscription." });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Vérification de l'utilisateur
            const user = await User.findOne({ username })
            if (!user)
                return res.status(400).json({ message: "Nom d'utilisateur incorrect." });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid)
                return res.status(400).json({ message: "Mot de passe incorrect."})

            res.status(200).json({message: "Connexion réussie."})
        } catch (error) {
            // console.error(error);
            res.status(500).json({ message: "Echec lors de la connexion." });
        }
    }

}
