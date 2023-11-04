const util = require('util');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 }, // Limite de 100 Mo
}).single('file');

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = { uploadFileMiddleware };
