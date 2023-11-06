const router = require('express').Router();
const { addDoctor, deleteDoctor, getdoctorbyid, getallDoctor, editDoctor } = require("../Controllers/doctorController");
const upload = require("../utils/multer")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");

router.post('/addDoctor', verifyTokenwithAdmin, upload.single("doctorspicture"), addDoctor);
router.put('/editDoctor/:id', verifyTokenwithAdmin, upload.single("doctorspicture"), editDoctor);
router.delete('/deleteDoctor/:id', verifyTokenwithAdmin, deleteDoctor);
router.get('/getdoctorbyid/:id', verifyTokenwithAuthorization, getdoctorbyid);
router.get('/getallDoctor', verifyTokenwithAuthorization, getallDoctor);






module.exports = router;
