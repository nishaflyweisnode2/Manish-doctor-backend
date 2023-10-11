const router = require('express').Router();
const { addhealthcategory,deletehealthcategory,gethealthcategorybyid,getallhealthcategory,edithealthCategory} = require("../Controllers/healthCategoryController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addhealthcategory',verifyTokenwithAdmin,upload.single("healthcategoryimage"), addhealthcategory);
router.put('/edithealthCategory/:id',verifyTokenwithAdmin,upload.single("healthcategoryimage"), edithealthCategory);
router.delete('/deletehealthcategory/:id',verifyTokenwithAdmin, deletehealthcategory);
router.get('/gethealthcategorybyid/:id',verifyTokenwithAuthorization, gethealthcategorybyid);
router.get('/getallhealthcategory',verifyTokenwithAuthorization, getallhealthcategory);






module.exports = router;
