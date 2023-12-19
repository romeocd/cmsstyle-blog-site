const express = require('express');
const { getHomePage, getDashboardPage } = require('../controllers/homeController');
const router = express.Router();

// Route for the homepage
router.get('/', getHomePage);

// Route for the user's dashboard
router.get('/dashboard', getDashboardPage);

module.exports = router;