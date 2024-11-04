const express = require('express');
const router = express.Router();
const Module = require('../models/module');
const Course = require('../models/course');

// Show form to create a new module
router.get('/create', (req, res) => {
  res.render('modules/create', { courseId: req.query.courseId });
});

// Handle module creation
router.post('/create', async (req, res) => {
  const module = new Module(req.body);
  await module.save();

  await Course.findByIdAndUpdate(req.body.courseId, {
    $push: { modules: module._id }
  });

  res.redirect(`/courses/${req.body.courseId}`);
});

// Show module details with lessons
router.get('/:id', async (req, res) => {
  const module = await Module.findById(req.params.id).populate('lessons');
  console.log(module);
  
  res.render('modules/show', { module });
});

module.exports = router;
