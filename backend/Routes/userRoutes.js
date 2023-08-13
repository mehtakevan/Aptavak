const express = require('express');
const { registerUser, authUser, allUsers } = require('../Controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");

 router.route('/').post(registerUser).get(protect,allUsers);
 router.post('/login',authUser);


module.exports = router;