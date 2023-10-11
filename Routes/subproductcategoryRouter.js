const router = require('express').Router();
const {editsubCategory,addsubproductcategory,getsubcategorybycategoryid,getsubcategorybyid,getallsubcategory,deletesubcategory} = require("../Controllers/subproductcategoryController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addsubproductcategory',verifyTokenwithAdmin,upload.single("subproductcategoryimage"), addsubproductcategory);
router.get('/getsubcategorybycategoryid/:productcategoryid',verifyTokenwithAuthorization, getsubcategorybycategoryid);
router.get('/getsubcategorybyid/:id',verifyTokenwithAuthorization, getsubcategorybyid);
router.get('/getallsubcategory',verifyTokenwithAuthorization, getallsubcategory);
router.delete('/deletesubcategory/:id',verifyTokenwithAdmin, deletesubcategory);
router.put('/editsubCategory/:id',verifyTokenwithAdmin,upload.single("subproductcategoryimage"), editsubCategory);







module.exports = router;
