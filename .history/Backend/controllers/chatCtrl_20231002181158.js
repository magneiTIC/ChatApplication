const Chat = require("../models/chat")
module.exports={

    // Création d'une nouvelle conversation
    async createChat(req,res){
        try {
            // On récupère les informations des participants de la conversation
            const {users}=req.body
            const newChat= new Chat
        

        } 
        
        catch (error) {
            
        }
    }
}