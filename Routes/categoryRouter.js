const router = require('express').Router();
const { addcategory,deletecategory,getcategorybyid,getallcategory,editCategory} = require("../Controllers/categoryController");
const upload=require("../utils/multer")
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addcategory',verifyTokenwithAdmin,upload.single("categoryimage"), addcategory);
router.put('/editCategory/:id',verifyTokenwithAdmin,upload.single("categoryimage"), editCategory);
router.delete('/deletecategory/:id',verifyTokenwithAdmin, deletecategory);
router.get('/getcategorybyid/:id',verifyTokenwithAuthorization, getcategorybyid);
router.get('/getallcategory',verifyTokenwithAuthorization, getallcategory);






module.exports = router;
