const express = require('express');
const router = express.Router();
const appointmentController = require('../Controllers/appointmentController');

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post('/appointments', verifyToken, appointmentController.createAppointment);
router.get('/appointments', verifyToken, appointmentController.getAppointments);
router.get('/appointments/:appointmentId', verifyToken, appointmentController.getAppointmentById);
router.post('/appointments', verifyToken, appointmentController.createAppointment);
router.put('/appointments/:appointmentId', verifyToken, appointmentController.updateAppointment);
router.delete('/appointments/:appointmentId', verifyToken, appointmentController.deleteAppointment);
router.put('/appointments/update-status/:appointmentId', verifyToken, appointmentController.updateAppointmentStatus);




module.exports = router;
