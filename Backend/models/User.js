const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        // required: true,
        unique: true,
    },
    uid: {
        type: String,
        // required: true,
        unique: true,
    },
    division:
    {
        type: String,
        required: true,
        enum: ['Sécurité Publique', 'Police Judiciaire', 'Surveillance du territoire']
    },
    profile: {
        type: String,
        required: true,
        enum: ['ADMIN', 'DIRECTEUR', 'AGENT']
    },
    devices: [
        {
            deviceId: String,
            userAgent: String,
            timestamp: Date,
        }
    ],
    connectionTime: Date,
    disconnectionTime: Date, 
    status: String
},

    { collection: "Users" });

module.exports = mongoose.model("User", userSchema);