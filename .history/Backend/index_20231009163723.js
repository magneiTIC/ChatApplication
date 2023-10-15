const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');
const mongoose = require('mongoose')
const dbConfig = require("./config/db.conf")
const socketIo = require("socket.io")
       

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

require("dotenv").config();

app.use(bodyParser.json());

app.use(cors()); // Configure CORS

// Appliquez le middleware de vérification du token JWT aux routes nécessitant une authentification
const checkAuth = require('./middleware/middleware')
app.get('/admin/create-user', checkAuth, (req, res) => {
      // La route est protégée et l'utilisateur est authentifié
  res.json({ message: 'Vous avez accès à cette ressource protégée.' });
});

// Appel des routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const userRoutes = require("./routes/userRoutes");
app.use('/users', userRoutes);

const chatRoutes=require("./routes/")
//connexion à mongodb
mongoose.connect(dbConfig.mongoURI, dbConfig.mongoOptions)
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err);
  });



//lancement de l'application
const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});



//lancement socket
const io = socketIo(server,{
    cors:{
        origin:"*",
        methods: ["GET", "POST"]
    }
});
 require('./config/socket.config')(io);

