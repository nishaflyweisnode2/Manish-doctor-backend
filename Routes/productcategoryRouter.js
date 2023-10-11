const router = require('express').Router();
const { addProductCat,deletecategory,getcategorybyid,getallcategory,editCategory} = require("../Controllers/productcategoryController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addProductCat',verifyTokenwithAdmin,upload.single("productcatimage"), addProductCat);
router.put('/editCategory/:id',verifyTokenwithAdmin,upload.single("productcatimage"), editCategory);
router.delete('/deletecategory/:id',verifyTokenwithAdmin, deletecategory);
router.get('/getcategorybyid/:id',verifyTokenwithAuthorization, getcategorybyid);
router.get('/getallcategory',verifyTokenwithAuthorization, getallcategory);






module.exports = router;
