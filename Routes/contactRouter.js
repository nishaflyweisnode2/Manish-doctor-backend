const router = require('express').Router();
const { addContact,deleteContact,getcontact,editContact} = require("../Controllers/contactController");
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addContact',verifyTokenwithAdmin,addContact);
router.put('/editContact/:id',verifyTokenwithAdmin, editContact);
router.delete('/deleteContact/:id',verifyTokenwithAdmin, deleteContact);
router.get('/getcontact',verifyTokenwithAuthorization, getcontact);






module.exports = router;
