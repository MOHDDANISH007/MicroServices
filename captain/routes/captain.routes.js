const express = require('express');
const captainController = require('../controller/captain.controller.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', captainController.registerUser);
router.post('/login', captainController.loginUser);
router.get('/profile', auth, captainController.getProfile); // 🔒 Protected
router.post('/logout', captainController.logoutUser);
router.patch('/availability', auth, captainController.toggleAvailability); // renamed for clarity

module.exports = router;
