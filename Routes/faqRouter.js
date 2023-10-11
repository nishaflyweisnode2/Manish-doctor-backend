const router = require('express').Router();
const { addfaqs,deletefaq,getallfaz,getsinglefaq,editfaq} = require("../Controllers/faqController");
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addfaqs',verifyTokenwithAdmin,addfaqs);
router.delete('/deletefaq/:id',verifyTokenwithAdmin, deletefaq);
router.get('/getsinglefaq/:id',verifyTokenwithAuthorization, getsinglefaq);
router.put('/editfaq/:id',verifyTokenwithAdmin, editfaq);
router.get('/getallfaz',verifyTokenwithAuthorization, getallfaz);






module.exports = router;
