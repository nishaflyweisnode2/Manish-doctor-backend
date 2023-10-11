const router = require('express').Router();
const {updatestate,getallhealthtestbystatus,editTestProduct,addhealthtest,gethealthtestbyheathcategoryid,gethealthtestbyid,getallhealthtest,deletetesthealth} = require("../Controllers/testhealthController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addhealthtest',verifyTokenwithAdmin,upload.single("testimage"), addhealthtest);
router.get('/gethealthtestbyheathcategoryid/:healthtestcategoryid',verifyTokenwithAuthorization, gethealthtestbyheathcategoryid);
router.get('/gethealthtestbyid/:id',verifyTokenwithAuthorization, gethealthtestbyid);
router.get('/getallhealthtest',verifyTokenwithAuthorization, getallhealthtest);
router.get('/getallhealthtestbystatus',verifyTokenwithAuthorization, getallhealthtestbystatus);
router.delete('/deletetesthealth/:id',verifyTokenwithAdmin, deletetesthealth);
router.put('/editTestProduct/:id',verifyTokenwithAdmin,upload.single("testimage"), editTestProduct);
router.patch('/updatestate/:id',verifyTokenwithAdmin, updatestate);







module.exports = router;
