const Chat = require("../models/chat")
module.exports={

    // Création d'une nouvelle conversation
    async createChat(req,res){
        try {
            // On récupère les informations des participants de la conversation
            const {users}=req.body
            const newChat= new Chat({users})
        await newConversation.save();
        res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }

        } 
        
        catch (error) {
            
        }
    }
}