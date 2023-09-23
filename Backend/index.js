const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const verifyToken = require("./middleware/middleware")


// Initialize Firebase Admin SDK
const serviceAccount = require('./config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
require("dotenv").config();
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN");
    next();
  });

app.use(cors({ origin : true }));
app.use(express.json());

// app.get('/admin-only', checkAdminAuth, (req, res) => {
//     // Cette route est accessible uniquement pour les administrateurs
//     res.send('Page réservée aux administrateurs');
// });

// app.post('/*', checkAuth);

// Appliquez le middleware de vérification du token JWT aux routes nécessitant une authentification
app.get('/admin/create-user', verifyToken, (req, res) => {
    // Vous pouvez accéder aux informations de l'utilisateur via req.user
    const userId = req.user.uid;
    res.send(`Route protégée pour l'utilisateur avec l'ID : ${userId}`);
  });

// Appel des routes
const adminRoutes = require('./routes/adminRoutes')
app.use('/admin', adminRoutes);
const userRoutes = require("./routes/userRoutes");
app.use('/users', userRoutes)

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connection Successfull");
}).catch((error) => {
    console.log(error.message);
})


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
})

