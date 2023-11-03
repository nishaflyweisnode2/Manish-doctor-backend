const router = require('express').Router();
const { signUp, login, forgotPassword, resetPassword, verifyOtp, getuserprofile, getallusers, updateusersprofile } = require("../Controllers/userAuthController");
const upload = require("../utils/multer")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");

router.post('/signup', signUp);
router.post('/login', login)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verifyOtp', verifyOtp)
router.get('/getuserprofile/me', verifyToken, getuserprofile)
router.get('/getallusers', verifyTokenwithAdmin, getallusers)
router.put('/updateusersprofile/me', verifyToken, upload.single("userspicture"), updateusersprofile);
/* 
router.post('/verify',verifyToken,verifyOtp)

router.get('/getallstudents',verifyTokenwithAdmin,getallstudents)
router.get('/getstudentprofile/me',verifyToken,getstudentprofile) */





module.exports = router;
