const router = require('express').Router();
const { AddAboutme} = require("../Controllers/aboutselfController");
//const upload=require("../utils/multer")
const { verifyToken} = require("../Middlewares/verifyToken");

router.post('/addaboutme',verifyToken, AddAboutme);






module.exports = router;
