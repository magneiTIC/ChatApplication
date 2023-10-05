const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    uid:{
        type:String,
        required:true,
        unique: true,
    },
    division:
    {
        type: String,
        required: true,
        enum: ['Sécurité Publique', 'Police Judiciaire', 'Surveillance du territoire']
    }
}, 

{ collection: "Users" });

module.exports = mongoose.model("Users", userSchema);