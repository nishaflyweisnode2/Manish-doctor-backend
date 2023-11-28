const router = require('express').Router();
const { SignUpUser, loginUser, verifyOTP, resendOTP, addDoctorByAdmin, adminDeleteDoctorById, adminGetDoctorById, adminGetAllDoctors, updateDoctorById, registration1, registration2, registration2body, registration3, updateProfile, updateDoctorAvailability, updateNumberOfPatients, deleteDoctorSlot, getDoctorAppointment,
    getAllDoctors, getDoctorById, getDoctor, deleteDoctor, getPatientsByDoctorId, addRatingAndReview, getDoctorRatings, updateReview, deleteReview, getAllReviews, addReplyToRating } = require("../Controllers/doctorController");
const upload = require("../utils/multer")
const { kpUpload, storage11 } = require("../utils/cloudinary")

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post("/signup", SignUpUser);
router.post("/login", loginUser);
router.post("/verify/otp/:id", verifyOTP);
router.post("/resend/otp", resendOTP);
router.post('/addDoctor', verifyTokenwithAdmin, upload.single("doctorspicture"), addDoctorByAdmin);
router.get('/getallDoctor', verifyTokenwithAuthorization, adminGetAllDoctors);
router.get('/getdoctorbyid/:id', verifyTokenwithAdmin, adminGetDoctorById);
router.put('/updateDoctor/:id', verifyTokenwithAdmin, upload.single("doctorspicture"), updateDoctorById);
router.delete('/deleteDoctor/:id', verifyTokenwithAdmin, adminDeleteDoctorById);
router.put('/registration1/:doctorId', verifyToken, upload.single("doctorspicture"), registration1);
router.put('/registration2/:id', verifyToken, kpUpload, registration2);
router.put('/registration2body/:id', verifyToken, kpUpload, registration2body);
router.put('/registration3/:doctorId', verifyToken, upload.single("idProof"), registration3);
router.put('/update-profile/:doctorId', verifyToken, storage11.single("doctorspicture"), updateProfile);
router.get('/doctors', verifyToken, getAllDoctors);
router.get('/doctors/:doctorId', verifyToken, getDoctorById);
router.get('/doctors/doctor/profile', verifyToken, getDoctor);
router.delete('/doctors/:doctorId', verifyToken, deleteDoctor);
router.put('/admin/doctors/:doctorId/updateAvailability', verifyTokenwithAdmin, updateDoctorAvailability);
router.put('/doctors/:doctorId/updateAvailability', verifyToken, updateDoctorAvailability);
router.put('/admin/doctors/:doctorId/updateNumberOfPatients', verifyTokenwithAdmin, updateNumberOfPatients);
router.put('/doctors/:doctorId/updateNumberOfPatients', verifyToken, updateNumberOfPatients);
router.delete('/admin/doctors/:doctorId/deleteSlot/:slotId', verifyTokenwithAdmin, deleteDoctorSlot);
router.delete('/doctors/:doctorId/deleteSlot/:slotId', verifyToken, deleteDoctorSlot);
router.get('/doctors/appointments/:doctorId', verifyToken, getDoctorAppointment)
router.get('/doctors/:doctorId/patients', verifyToken, getPatientsByDoctorId);
router.post('/doctors/:doctorId/ratings', verifyToken, addRatingAndReview);
router.get('/doctors/:doctorId/ratings', verifyToken, getDoctorRatings);
router.put('/doctors/:doctorId/reviews/:reviewId', verifyToken, updateReview);
router.delete('/doctors/:doctorId/reviews/:reviewId', verifyToken, deleteReview);
router.get('/doctor-reviews/:doctorId', verifyToken, getAllReviews);
router.post('/ratings/:doctorId/:ratingId/reply', verifyToken, addReplyToRating);








module.exports = router;
