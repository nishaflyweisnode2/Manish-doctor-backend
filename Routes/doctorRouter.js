const router = require('express').Router();
const { SignUpUser, verifyOTP, resendOTP, addDoctorByAdmin, deleteDoctorById, getDoctorById, getAllDoctors, updateDoctorById, registration1, registration2, updateDoctorAvailability, updateNumberOfPatients, deleteDoctorSlot } = require("../Controllers/doctorController");
const upload = require("../utils/multer")
const kpUpload = require("../utils/cloudinary")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post("/signup", SignUpUser);
router.post("/verify/otp/:id", verifyOTP);
router.post("/resend/otp", resendOTP);
router.post('/addDoctor', verifyTokenwithAdmin, upload.single("doctorspicture"), addDoctorByAdmin);
router.get('/getallDoctor', verifyTokenwithAuthorization, getAllDoctors);
router.get('/getdoctorbyid/:id', verifyTokenwithAdmin, getDoctorById);
router.put('/updateDoctor/:id', verifyTokenwithAdmin, upload.single("doctorspicture"), updateDoctorById);
router.delete('/deleteDoctor/:id', verifyTokenwithAdmin, deleteDoctorById);
router.put('/registration1/:doctorId', verifyToken, upload.single("doctorspicture"), registration1);
router.put('/registration2/:id', verifyToken, kpUpload, registration2);
router.put('/doctors/:doctorId/updateAvailability', verifyTokenwithAdmin, updateDoctorAvailability);
router.put('/doctors/:doctorId/updateNumberOfPatients', verifyTokenwithAdmin, updateNumberOfPatients);
router.delete('/doctors/:doctorId/deleteSlot/:slotId', verifyTokenwithAdmin, deleteDoctorSlot);





module.exports = router;
