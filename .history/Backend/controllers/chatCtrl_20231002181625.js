const Chat = require("../models/chat")
module.exports = {

    // Création d'une nouvelle conversation
    async createChat(req, res) {
        try {
            // On récupère les informations des participants de la conversation
            const { users } = req.body
            const newChat = new Chat({ users })
            const chat = await newConversation.save();
            if (chat){
                console.log("conversation créée avec succès");
                return res.status(200).json({message:"conversation créée avec succès"})
            }
            else {
                res.status(400).json({message:})
            }

        }

        catch (error) {

        }
    }
}