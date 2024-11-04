const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Show all courses
router.get('/', async (req, res) => {
  const courses = await Course.find().populate('modules');
  res.render('courses/allCourses', { courses });
});

// Show form to create a new course
router.get('/create', (req, res) => {
  res.render('courses/create');
});

// Handle course creation
router.post('/create', async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.redirect('/courses');
});

// Show a specific course
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('modules');
  res.render('courses/show', { course });
});


router.get('/index/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'modules',
    populate: {
      path: 'lessons',
      populate: { path: 'topics' }
    }
  });
  res.render('courses/index', { course });
});



module.exports = router;
