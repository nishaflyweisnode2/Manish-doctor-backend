const router = require('express').Router();
const { addspecialist,deletespecialist,getspecialistbyid,getallspecialist,editSpecialist} = require("../Controllers/specialistController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addspecialist',verifyTokenwithAdmin,upload.single("specialistimage"), addspecialist);
router.put('/editSpecialist/:id',verifyTokenwithAdmin,upload.single("specialistimage"), editSpecialist);
router.delete('/deletespecialist/:id',verifyTokenwithAdmin, deletespecialist);
router.get('/getspecialistbyid/:id',verifyTokenwithAuthorization, getspecialistbyid);
router.get('/getallspecialist',verifyTokenwithAuthorization, getallspecialist);






module.exports = router;
