const express = require('express')
const userController = require('../controller/users.controller.js')
const auth = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/profile', auth, userController.getProfile) // 🔒 Protected route
router.post('/logout', userController.logoutUser)

module.exports = router
