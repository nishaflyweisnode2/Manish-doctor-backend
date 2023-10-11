const router = require('express').Router();
const { searchProducts,Addproducts,getallProducts,getproductbyid,deleteProduct,editproduct,getproductbysubcategoryid } = require("../Controllers/productController")

router.post('/addproducts', Addproducts);
router.get('/getallproducts', getallProducts);
router.get('/getproductbyid/:id', getproductbyid);
router.delete('/deleteProduct/:id', deleteProduct);
router.put('/editproduct/:id', editproduct);
router.get('/getproductbysubcategoryid/:subcategory', getproductbysubcategoryid);
router.get('/searchProducts', searchProducts);


module.exports = router;
