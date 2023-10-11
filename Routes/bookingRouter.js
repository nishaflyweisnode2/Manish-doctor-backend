const router = require('express').Router();
const {completedappointment,cancelappointment,getbookingbystatus,editbooking,addBook,getBookingbypreferenceid,getbookingbyid,getBookingbyuserid,getallBooking,deleteBooking} = require("../Controllers/bookingController");
const { verifyToken,verifyTokenwithAuthorization, verifyTokenwithAdmin} = require("../Middlewares/verifyToken");

router.post('/addBook',verifyToken,addBook);
router.get('/getBookingbypreferenceid/:preferenceID',verifyTokenwithAdmin, getBookingbypreferenceid);
router.get('/getbookingbyid/:id',verifyTokenwithAdmin, getbookingbyid);
router.get('/getallBooking',verifyTokenwithAdmin, getallBooking);
router.get('/getBookingbyuserid/me',verifyToken, getBookingbyuserid);
router.get('/getbookingbystatus',verifyTokenwithAuthorization, getbookingbystatus);
router.delete('/deleteBooking/:id',verifyTokenwithAuthorization, deleteBooking);
router.put('/editbooking/:id',verifyToken, editbooking);
router.patch('/cancelappointment/:id',verifyTokenwithAdmin, cancelappointment);
router.patch('/completedappointment/:id',verifyTokenwithAdmin, completedappointment);







module.exports = router;
