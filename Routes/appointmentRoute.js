const express = require('express');
const router = express.Router();
const appointmentController = require('../Controllers/appointmentController');

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post('/appointments', verifyToken, appointmentController.createAppointment);

router.post('/checkAvailability/:doctorId', verifyToken, appointmentController.checkDoctorAvailability)

module.exports = router;
