const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
});

module.exports = mongoose.model('Lesson', LessonSchema);
