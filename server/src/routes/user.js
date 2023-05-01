const express = require('express');
const router = express.Router();
const JobController = require('../controllers/user/JobController');
const JobApplicationController = require('../controllers/user/JobApplicationController');
const auth = require('../middlewares/auth.js');

router.use(auth.user);

// job routes
router.get('/job/list', JobController.list);
router.get('/job/:id', JobController.get);

// job application
router.post('/job-application/submit/:id', JobApplicationController.submit);


module.exports = router;