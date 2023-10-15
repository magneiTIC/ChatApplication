const Chat = require("../models/chat")
module.exports = {

    // Création d'une nouvelle conversation
    async createChat(req, res) {
        try {
            // On récupère les informations des participants de la conversation
            const { users } = req.body
            const newChat = new Chat({ users })
            await newConversation.save();
            console.log("conversation créée avec succès");
            return res.status(200).json({ message: "conversation créée avec succès" })

        }
        catch (error) {
            
            res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
        }

    },

    //Liste des conversations d'un user
    async getChatByUser(req, res) {
        try {
            const userId = req.params.userId;
            const chats = await Conversation.find({ users: userId });
            res.status(200).json(chats);
        }

        catch (error) {

        }
    }
}