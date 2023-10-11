const router = require('express').Router();
const { addtestimony,getalltestimony,getsingletestimony,editTestimony,deletetestimony} = require("../Controllers/testimonyController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addtestimony',verifyTokenwithAdmin,upload.single("testimonyimage"), addtestimony);
router.put('/editTestimony/:id',verifyTokenwithAdmin,upload.single("testimonyimage"), editTestimony);
router.get('/getalltestimony',verifyTokenwithAuthorization, getalltestimony);
router.get('/getsingletestimony/:id',verifyTokenwithAuthorization, getsingletestimony);
router.delete('/deletetestimony/:id',verifyTokenwithAdmin, deletetestimony);






module.exports = router;
