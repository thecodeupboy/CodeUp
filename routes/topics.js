const express = require('express');
const router = express.Router();
const Lesson = require('../models/lesson');
const Topic = require('../models/topic');

// Show form to create a new topic
router.get('/create', (req, res) => {
  res.render('topics/create', { lessonId: req.query.lessonId });
});

// Handle topic creation
router.post('/create', async (req, res) => {
  const topic = new Topic(req.body);
  await topic.save();

  await Lesson.findByIdAndUpdate(req.body.lessonId, {
    $push: { topics: topic._id }
  });

  res.redirect(`/lessons/${req.body.lessonId}`);
});

// Show topic details
router.get('/:id', async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  res.render('topics/show', { topic });
});

module.exports = router;
