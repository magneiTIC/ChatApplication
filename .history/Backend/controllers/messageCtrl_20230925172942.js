module.exports={
    sendMessage(req, res) {
        const { user, text } = req.body;
      
        if (!user || !text) {
          return res.status(400).json({ error: 'Les champs utilisateur et texte sont requis.' });
        }
      
        const message = new Message({ user, text });
      
        message.save((err, savedMessage) => {
          if (err) {
            console.error('Erreur lors de l\'enregistrement du message dans la base de données :', err);
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message dans la base de données.' });
          }
      
          res.status(201).json(savedMessage);
        });
    },
}