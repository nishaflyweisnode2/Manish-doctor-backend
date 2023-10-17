const router = require('express').Router();
const { searchProducts, Addproducts, getallProducts, getproductbyid, deleteProduct, editProduct, getproductbysubcategoryid } = require("../Controllers/productController")
const upload = require("../utils/multer")


router.post('/addproducts', upload.single("productimage"), Addproducts);
router.get('/getallproducts', getallProducts);
router.get('/getproductbyid/:id', getproductbyid);
router.delete('/deleteProduct/:id', deleteProduct);
router.put('/editproduct/:id', upload.single("productimage"), editProduct);
router.get('/getproductbysubcategoryid/:subproductcategories', getproductbysubcategoryid);
router.get('/searchProducts', searchProducts);


module.exports = router;
