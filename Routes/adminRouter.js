const router = require('express').Router();
const { adminregistration, authlogin } = require("../Controllers/adminController")

router.post('/registration', adminregistration);
router.post('/adminlogin', authlogin);

module.exports = router;
