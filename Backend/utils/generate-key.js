// const crypto = require('crypto');

// module.exports = function cryptoKey() {
//   // Générer une paire de clés RSA (2048 bits)
//   const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem',
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem',
//     },
//   });
//   // Générez une clé de chiffrement (une chaîne hexadécimale aléatoire)
//   const encryptionKey = crypto.randomBytes(32).toString('hex');
//   // Créez un chiffreur pour la clé maîtresse
//   const cipher = crypto.createHash('aes-256-ctr', encryptionKey);
//   // Chiffrez la clé privée
//   let encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex');
//   encryptedPrivateKey += cipher.final('hex');
//   console.log('Clé privée chiffrée :');
//   console.log(encryptedPrivateKey);

//   // Chiffrement de la paire de clés RSA avec une clé de chiffrement symétrique (à des fins de démonstration)
//   // const encryptionKey = 'VotreCleDeChiffrementSymetrique'; // Remplacez par votre clé symétrique
//   // const cipher = crypto.createHash('aes-256-cbc', encryptionKey);
//   // const encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'base64') + cipher.final('base64');

//   // Route pour générer la paire de clés
//   // app.get('/generate-keys', (req, res) => {
//   //   res.json({ publicKey, privateKey });
//   // });



//   // Route pour chiffrer un message
//   // app.get('/encrypt', (req, res) => {
//   //   const message = 'Hello, world!';
//   //   const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));
//   //   res.json({ encryptedMessage: encryptedMessage.toString('base64') });
//   // });

//   // Route pour déchiffrer un message
//   // app.get('/decrypt', (req, res) => {
//   //   // Utilisez la clé privée pour déchiffrer le message
//   //   const encryptedMessage = Buffer.from(req.query.encryptedMessage, 'base64');
//   //   const decryptedMessage = crypto.privateDecrypt(privateKey, encryptedMessage);
//   //   res.json({ decryptedMessage: decryptedMessage.toString() });
//   // });

//   // app.listen(port, () => {
//   //   console.log(`Serveur Express écoutant sur le port ${port}`);
//   // });
// }


//   // Générez une clé de chiffrement (une chaîne hexadécimale aléatoire)
//         const encryptionKey = crypto.randomBytes(32);

//         // Créez un chiffreur pour la clé maîtresse
//         const cipher = crypto.createCipheriv('aes-256-ctr', encryptionKey, Buffer.alloc(16));
//         // Chiffrez la clé privée
//         let encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex') + cipher.final('hex');
//         console.log('Clé privée chiffrée :');
//         console.log(encryptedPrivateKey);

//         // Créez un déchiffreur pour la clé maîtresse
//         const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionKey, Buffer.alloc(16));
//         // Déchiffrez la clé privée
//         let decryptedPrivateKey = decipher.update(encryptedPrivateKey, 'hex', 'utf8') + decipher.final('utf8');
//         console.log('Clé privée déchiffrée :');
//         console.log(decryptedPrivateKey);