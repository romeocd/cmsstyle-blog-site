const express = require('express');
const { createUser, loginUser, logoutUser } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', createUser); // Sign up
router.post('/login', loginUser);    // Login
router.post('/logout', logoutUser);  // Logout

module.exports = router;