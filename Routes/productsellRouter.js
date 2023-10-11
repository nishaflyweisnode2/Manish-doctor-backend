const router = require('express').Router();
const {editsellproduct,addsellproductcategory,getallsellproduct,getsellproductbyid,getsubcategorybycategoryid,deleteproduct} = require("../Controllers/productsalesController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addsellproductcategory',verifyTokenwithAdmin,upload.single("image"), addsellproductcategory);
router.get('/getallsellproduct',verifyTokenwithAuthorization, getallsellproduct);
router.get('/getsellproductbyid/:id',verifyTokenwithAuthorization, getsellproductbyid);
router.get('/getsubcategorybycategoryid/:subproductcategoryid',verifyTokenwithAuthorization, getsubcategorybycategoryid);
router.delete('/deleteproduct/:id',verifyTokenwithAdmin, deleteproduct);
router.put('/editsellproduct/:id',verifyTokenwithAdmin,upload.single("image"), editsellproduct);






module.exports = router;
