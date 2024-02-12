const express = require('express');

const apiRoutes = require('./api/index');
const homeRoutes = require('./homeRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;