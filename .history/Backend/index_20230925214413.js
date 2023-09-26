const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');

const mongoose=require('mongoose')
const dbConfig=require("./config/db.conf")

const socketIo = require("socket.io")


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

require("dotenv").config();

app.use(bodyParser.json());

app.use(cors()); // Configure CORS

// Appliquez le middleware de vérification du token JWT aux routes nécessitant une authentification
// app.get('/admin/create-user', checkAuth, (req, res) => {
//     // Vous pouvez accéder aux informations de l'utilisateur via req.user
//     const userId = req.user.uid;
//     res.send(`Route protégée pour l'utilisateur avec l'ID : ${userId}`);
// });

// Appel des routes

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const userRoutes = require("./routes/userRoutes");
app.use('/users', userRoutes);

//connexion à mongodb
mongoose.connect(dbConfig.mongoURI, dbConfig.mongoOptions)
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err);
  });



//lancement de l'application
// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server Started on Port ${process.env.PORT}`);
// });
const server = app.listen(3000, () => {
    console.log(`Server Started on Port 3000`);
});

const io = socketIo(server, { pingTimeout: 60000 });
 //require('./config/socket.config')(io);
// io.on('connection', (socket) => {
//     console.log('Un utilisateur s\'est connecté');
  
//     socket.on('disconnect', () => {
//       console.log('Un utilisateur s\'est déconnecté');
//     });
  
    
//   });
// ...

module.exports = io => {
    io.on("connection", socket => {
        console.log("Utilisateur connecté");

        socket.on("disconnect", () => {
            console.log("Utilisateur déconnecté");
            socket.emit("Utilisateur déconnecté");
            socket.disconnect();
        });

        // messages entrants
        socket.on('chat message', (data) => {
            console.log('Message reçu : ', data);

            // Enregistrement du message dans MongoDB
            const message = new Message({ user: data.user, text: data.message });
            message.save((err) => {
                if (err) {
                    console.error('Error saving message to database:', err);
                } else {
                    console.log('Message saved to the database');
                }
            });
        });

        socket.on('close', (code, reason) => {
            console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
        });
    });
};
