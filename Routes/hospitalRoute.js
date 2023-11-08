const express = require('express');
const router = express.Router();
const hospitalController = require('../Controllers/hospitalController');
const upload = require("../utils/multer")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");



router.post('/hospitals', verifyTokenwithAdmin, upload.single("image"), hospitalController.createHospital);
router.get('/hospitals', verifyToken, hospitalController.getAllHospital);
router.get('/hospitals/:id', verifyToken, hospitalController.getHospital);
router.put('/hospitals/:id', verifyTokenwithAdmin, upload.single("image"), hospitalController.updateHospital);
router.delete('/hospitals/:id', verifyTokenwithAdmin, hospitalController.deleteHospital);

module.exports = router;
