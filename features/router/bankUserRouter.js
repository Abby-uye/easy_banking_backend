const express = require('express');
const router = express.Router();
const {register,verifyUser} = require("../controllers/userController")

router.route("/register").post(register);
router.route("/verify").post(verifyUser)


module.exports = router;