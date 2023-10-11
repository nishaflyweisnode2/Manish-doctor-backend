const router = require('express').Router();
const { addsupport,deletesupport,getallsupport,getsinglesupport} = require("../Controllers/supportController");
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addsupport',verifyToken,addsupport);
router.delete('/deletesupport/:id',verifyTokenwithAdmin, deletesupport);
router.get('/getsinglesupport/:id',verifyTokenwithAdmin, getsinglesupport);
router.get('/getallsupport',verifyTokenwithAdmin, getallsupport);






module.exports = router;
