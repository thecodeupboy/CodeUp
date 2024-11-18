const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/thumbnails');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Show all courses
router.get('/', async (req, res) => {
  const courses = await Course.find().populate('modules');
  // res.render('courses/allCourses', { courses });
  // console.log(courses[0]._id);
  
  res.send(courses);  

});

// Show a specific course
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('modules');
  // res.render('courses/show', { course });
  res.send(course)
});

// Show form to create a new course
router.get('/create', (req, res) => {
  res.render('courses/create');
});


// Handle course creation
router.post('/create', upload.single('thumbnail'), async (req, res) => {
  console.log(req.file, "hi")
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    thumbnail: "D:/CodeUp/public/thumbnails/" + req.file.filename
  });
  await course.save();
  res.redirect('/courses');
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
