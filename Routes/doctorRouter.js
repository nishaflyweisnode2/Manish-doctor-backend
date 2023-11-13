const router = require('express').Router();
const { addDoctor, deleteDoctorById, getDoctorById, getAllDoctors, updateDoctorById, updateDoctorAvailability, updateNumberOfPatients, deleteDoctorSlot } = require("../Controllers/doctorController");
const upload = require("../utils/multer")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");

router.post('/addDoctor', verifyTokenwithAdmin, upload.single("doctorspicture"), addDoctor);
router.get('/getallDoctor', verifyTokenwithAuthorization, getAllDoctors);
router.get('/getdoctorbyid/:id', verifyTokenwithAuthorization, getDoctorById);
router.put('/updateDoctor/:id', verifyTokenwithAdmin, upload.single("doctorspicture"), updateDoctorById);
router.delete('/deleteDoctor/:id', verifyTokenwithAdmin, deleteDoctorById);
router.put('/doctors/:doctorId/updateAvailability', verifyTokenwithAdmin, updateDoctorAvailability);
router.put('/doctors/:doctorId/updateNumberOfPatients', verifyTokenwithAdmin, updateNumberOfPatients);
router.delete('/doctors/:doctorId/deleteSlot/:slotId', verifyTokenwithAdmin, deleteDoctorSlot);





module.exports = router;
