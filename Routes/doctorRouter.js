const router = require('express').Router();
const { addDoctor, deleteDoctorById, getDoctorById, getAllDoctors, updateDoctorById, updateDoctorAvailability } = require("../Controllers/doctorController");
const upload = require("../utils/multer")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");

router.post('/addDoctor', verifyTokenwithAdmin, upload.single("doctorspicture"), addDoctor);
router.get('/getallDoctor', verifyTokenwithAuthorization, getAllDoctors);
router.get('/getdoctorbyid/:id', verifyTokenwithAuthorization, getDoctorById);
router.put('/updateDoctor/:id', verifyTokenwithAdmin, upload.single("doctorspicture"), updateDoctorById);
router.delete('/deleteDoctor/:id', verifyTokenwithAdmin, deleteDoctorById);
router.put('/updateDoctorAvailability/:doctorId', verifyTokenwithAdmin, updateDoctorAvailability)





module.exports = router;
