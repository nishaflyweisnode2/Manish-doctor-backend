const express = require('express');
const router = express.Router();
const videoCallController = require('../Controllers/videoCallController');

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");



router.post('/video-calls', verifyToken, videoCallController.createVideoCall);
router.get('/video-calls', verifyToken, videoCallController.getAllVideoCalls);
router.get('/video-calls/:id', verifyToken, videoCallController.getVideoCallById);
router.put('/video-calls/:id', verifyToken, videoCallController.updateVideoCall);
router.delete('/video-calls/:id', verifyToken, videoCallController.deleteVideoCall);




module.exports = router;
