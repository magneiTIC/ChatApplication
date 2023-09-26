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


//lancement socket
const io = socketIo(3000,{
    
});
 require('./config/socket.config')(io);
//const options = config.options;


  
    

// io.on('connection', (socket) => {
//     console.log("Un utilisateur s'est connecté");
//     console.log(socket.id);
//     socket.on('disconnect', () => {
//      console.log("Un utilisateur s'est déconnecté");
//     });
    
//     io.on('chat-message', (data) => {
//         console.log('Message reçu : ', data);
       
//     });
//     io.emit('chat-message',"message du serveur vers le client")

//     socket.on('test2',(message)=>{
//         console.log("message du client vers le serveur",message)
//     })
    
//     socket.on('close', (code, reason) => {
//      console.log("La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}");
//     });
//    });