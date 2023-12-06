const express = require('express');
const router = express.Router();
const patientReportController = require('../Controllers/patentReportController');


const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");



router.post('/patient-reports', verifyToken, patientReportController.createPatientReport);
router.get('/patient-reports', verifyToken, patientReportController.getAllPatientReports);
router.get('/patient-reports/:reportId', verifyToken, patientReportController.getPatientReportById);
router.get('/patient-reports-user/:userId', verifyToken, patientReportController.getPatientReportByUserId);
router.put('/patient-reports/:reportId', verifyToken, patientReportController.updatePatientReport);
router.delete('/patient-reports/:reportId', verifyToken, patientReportController.deletePatientReport);


module.exports = router;
