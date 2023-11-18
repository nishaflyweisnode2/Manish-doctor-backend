const router = require('express').Router();
const { SignUpUser, verifyOTP, resendOTP, addDoctorByAdmin, adminDeleteDoctorById, adminGetDoctorById, adminGetAllDoctors, updateDoctorById, registration1, registration2, updateProfile, updateDoctorAvailability, updateNumberOfPatients, deleteDoctorSlot, getDoctorAppointment,
    getAllDoctors,getDoctorById,deleteDoctor } = require("../Controllers/doctorController");
const upload = require("../utils/multer")
const { kpUpload, storage11 } = require("../utils/cloudinary")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post("/signup", SignUpUser);
router.post("/verify/otp/:id", verifyOTP);
router.post("/resend/otp", resendOTP);
router.post('/addDoctor', verifyTokenwithAdmin, upload.single("doctorspicture"), addDoctorByAdmin);
router.get('/getallDoctor', verifyTokenwithAuthorization, adminGetAllDoctors);
router.get('/getdoctorbyid/:id', verifyTokenwithAdmin, adminGetDoctorById);
router.put('/updateDoctor/:id', verifyTokenwithAdmin, upload.single("doctorspicture"), updateDoctorById);
router.delete('/deleteDoctor/:id', verifyTokenwithAdmin, adminDeleteDoctorById);
router.put('/registration1/:doctorId', verifyToken, upload.single("doctorspicture"), registration1);
router.put('/registration2/:id', verifyToken, kpUpload, registration2);
router.put('/update-profile/:doctorId', verifyToken, storage11.single("doctorspicture"), updateProfile);
router.get('/doctors', verifyToken, getAllDoctors);
router.get('/doctors/:doctorId', verifyToken, getDoctorById);
router.delete('/doctors/:doctorId', verifyToken, deleteDoctor);
router.put('/doctors/:doctorId/updateAvailability', verifyTokenwithAdmin, updateDoctorAvailability);
router.put('/doctors/:doctorId/updateNumberOfPatients', verifyTokenwithAdmin, updateNumberOfPatients);
router.delete('/doctors/:doctorId/deleteSlot/:slotId', verifyTokenwithAdmin, deleteDoctorSlot);
router.get('/doctors/appointments/:doctorId', verifyToken, getDoctorAppointment)






module.exports = router;
