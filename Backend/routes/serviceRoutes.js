const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/serviceCtrl');


router.post('/collect-info', serviceCtrl.collectDeviceInfos);

// router.post('/screenshotDetected', serviceCtrl.screenshotDetected);


module.exports = router;
