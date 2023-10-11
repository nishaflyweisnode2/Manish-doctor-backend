const router = require('express').Router();
const {getcontentbyfaqID, addfaqcontent,deletecontentfaq,getallfazcontent,getsinglecontentfaq,editcontentfaq} = require("../Controllers/faqcontentContentController");
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addfaqcontent',verifyTokenwithAdmin,addfaqcontent);
router.delete('/deletecontentfaq/:id',verifyTokenwithAdmin, deletecontentfaq);
router.get('/getsinglecontentfaq/:id',verifyTokenwithAuthorization, getsinglecontentfaq);
router.put('/editcontentfaq/:id',verifyTokenwithAdmin, editcontentfaq);
router.get('/getallfazcontent',verifyTokenwithAuthorization, getallfazcontent);
router.get('/getcontentbyfaqID/:faqid',verifyTokenwithAuthorization,getcontentbyfaqID);






module.exports = router;
