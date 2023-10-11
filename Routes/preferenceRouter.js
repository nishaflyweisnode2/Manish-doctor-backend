const router = require('express').Router();
const {editpreference,addpreference,getpreferencebytestid,getpreferencebyid,getallpreference,deletepreference} = require("../Controllers/preferenceController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addpreference',verifyTokenwithAdmin,upload.single("preferenceimage"), addpreference);
router.get('/getpreferencebytestid/:testID',verifyTokenwithAuthorization, getpreferencebytestid);
router.get('/getpreferencebyid/:id',verifyTokenwithAuthorization, getpreferencebyid);
router.get('/getallpreference',verifyTokenwithAuthorization, getallpreference);
router.delete('/deletepreference/:id',verifyTokenwithAdmin, deletepreference);
router.put('/editpreference/:id',verifyTokenwithAdmin,upload.single("preferenceimage"), editpreference);







module.exports = router;
