const router = require('express').Router();
const { AddAboutme, getAboutMe } = require("../Controllers/aboutselfController");
//const upload=require("../utils/multer")
const { verifyToken } = require("../Middlewares/verifyToken");

router.post('/addaboutme', verifyToken, AddAboutme);
router.get('/addaboutme', verifyToken, getAboutMe);






module.exports = router;
