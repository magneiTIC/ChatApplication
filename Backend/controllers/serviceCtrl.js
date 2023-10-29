const User = require('../models/user'); // Modèle MongoDB pour les utilisateurs

module.exports = {


    async collectDeviceInfos(req, res) {
        const { deviceId, uid, userAgent } = req.body;
        console.log("From DeviceId: " + deviceId);
        console.log("From uid: " + uid);
        console.log("From userAgent: " + userAgent);
        try {
            const user = await User.findOne({ uid });
            if (user) {
                user.lastLogin = new Date();
                user.status = 'connecté';
                // Vérifie si un appareil avec le même deviceId existe
                const existingDevice = user.devices.find(device => device.deviceId === deviceId);
                if (existingDevice) {
                    // Met à jour le timestamp de l'appareil existant
                    existingDevice.timestamp = new Date();
                } else {
                    // Ajoute un nouvel appareil au tableau devices avec les informations sur le type d'appareil
                    user.devices.push({
                        deviceId,
                        userAgent,
                        timestamp: new Date(),
                    });
                }
                await user.save();
                res.status(200).json({ message: "Informations de l'appareil mises à jour avec succès" });
            } else {
                return res.status(404).json({ message: "Utilisateur non trouvé." });
            }
        } catch (err) {
            console.log("Erreur:", err);
            res.status(500).json({ error: "Erreur lors de la mise à jour des informations." });
        }
    }


    // async screenshotDetected(req, res) {
    //     const message = req.body.message;
    //     const userDetails = req.body.userDetails;
    //     console.log('Requête POST reçue :', req.body);
    //     console.log('Tentative de capture d\'écran détectée :', message);
    //     console.log('Détails de l\'utilisateur :', userDetails);
    //     // Vous pouvez ajouter ici la logique pour informer l'administrateur avec les détails de l'utilisateur.
    //     res.sendStatus(200);
    // },
}

// Ajoutez une tâche de fond pour vérifier l'inactivité des utilisateurs
setInterval(async () => {
    const users = await User.find({ status: 'connecté' });

    const currentTime = new Date();
    const inactivityThreshold = 45 * 60 * 1000; // 45 minutes en millisecondes

    users.forEach(async user => {
        const lastActivityTime = user.lastLogin;
        if (currentTime - lastActivityTime > inactivityThreshold) {
            // L'utilisateur est inactif depuis trop longtemps, mettez à jour son statut
            user.status = 'déconnecté';
            await user.save();
        }
    });
}, 60000); // Vérification toutes les 60 secondes
