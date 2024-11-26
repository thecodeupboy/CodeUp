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
  const courses = await Course.find();
  // res.render('courses/allCourses', { courses });
  res.send(courses);  

});

// Show form to create a new course
router.get('/create', (req, res) => {
  res.render('courses/create');
});

// Handle course creation
router.post('/create', upload.single('thumbnail'), async (req, res) => {
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    thumbnail: "thumbnails/" + req.file.filename,
    about: req.body.about
  });
  await course.save();
  res.redirect('/courses');
});


// Show a specific course
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'lessons',
    select: 'title _id', // Select only the title and _id for lessons
    populate: {
      path: 'topics',
      select: 'title _id', // Select only the title and _id for topics
    },
  });
  res.send(course)
});

router.get('/index/:id', async (req, res) => {
  const contentTable = await Course.findById(req.params.id).populate({
    path: 'lessons',
    select: 'title _id', // Select only the title and _id for lessons
    populate: {
      path: 'topics',
      select: 'title _id', // Select only the title and _id for topics
    },
  });
  res.render('courses/index', { course });
  // res.send(contentTable)
});

router.get('/delete/:id', async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  course.save()
  res.redirect('/courses')
});




module.exports = router;
