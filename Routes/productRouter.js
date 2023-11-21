const router = require('express').Router();
const { searchProducts, Addproducts, getallProducts, getproductbyid, deleteProduct, editProduct, getproductbysubcategoryid, createRating, getAllRatings, getRatingById, updateRating, deleteRating, addReplyToRating } = require("../Controllers/productController")
const upload = require("../utils/multer")

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post('/addproducts', upload.single("productimage"), Addproducts);
router.get('/getallproducts', getallProducts);
router.get('/getproductbyid/:id', getproductbyid);
router.delete('/deleteProduct/:id', deleteProduct);
router.put('/editproduct/:id', upload.single("productimage"), editProduct);
router.get('/getproductbysubcategoryid/:subproductcategories', getproductbysubcategoryid);
router.get('/searchProducts', searchProducts);
router.post('/product/:productId/ratings', verifyToken, createRating);
router.get('/product/:productId/ratings', verifyToken, getAllRatings);
router.get('/product/:productId/ratings/:ratingId', verifyToken, getRatingById);
router.put('/product/:productId/ratings/:ratingId', verifyToken, updateRating);
router.delete('/product/:productId/ratings/:ratingId', verifyToken, deleteRating);
router.post('/product/:productId/:ratingId/reply', verifyToken, addReplyToRating);



module.exports = router;
