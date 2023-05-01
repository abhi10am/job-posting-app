const express = require('express');
const router = express.Router();
const JobCategoryController = require('../controllers/admin/JobCategoryController');
const JobTypeController = require('../controllers/admin/JobTypeController');
const JobController = require('../controllers/admin/JobController');
const JobApplicationController = require('../controllers/admin/JobApplicationController');
const auth = require('../middlewares/auth.js');

router.use(auth.admin);

// job category routes
router.get('/job/category/list', JobCategoryController.list);
router.post('/job/category/create', JobCategoryController.create);
router.put('/job/category/update/:id', JobCategoryController.update);
router.delete('/job/category/delete/:id', JobCategoryController.delete);

// job type routes
router.get('/job/type/list', JobTypeController.list);
router.post('/job/type/create', JobTypeController.create);
router.put('/job/type/update/:id', JobTypeController.update);
router.delete('/job/type/delete/:id', JobTypeController.delete);

// job routes
router.get('/job/list', JobController.list);
router.get('/job/:id', JobController.get);
router.post('/job/create', JobController.create);
router.delete('/job/delete/:id', JobController.delete);

// job application routes
router.get('/job-application/list', JobApplicationController.list);
router.get('/job-application/:id', JobApplicationController.get);
router.post('/job-application/update-status/:id', JobApplicationController.updateStatus);



module.exports = router;