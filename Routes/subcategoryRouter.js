const router = require('express').Router();
const {editsubCategory,addsubcategory,getsubcategorybycategoryid,getsubcategorybyid,getallsubcategory,deletesubcategory/* deletecategory,getcategorybyid,getallcategory,editCategory */} = require("../Controllers/subcategoryController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addsubcategory',verifyTokenwithAdmin,upload.single("subcategoryimage"), addsubcategory);
router.get('/getsubcategorybycategoryid/:categoryid',verifyTokenwithAuthorization, getsubcategorybycategoryid);
router.get('/getsubcategorybyid/:id',verifyTokenwithAuthorization, getsubcategorybyid);
router.get('/getallsubcategory',verifyTokenwithAuthorization, getallsubcategory);
router.delete('/deletesubcategory/:id',verifyTokenwithAdmin, deletesubcategory);
router.put('/editsubCategory/:id',verifyTokenwithAdmin,upload.single("subcategoryimage"), editsubCategory);







module.exports = router;
