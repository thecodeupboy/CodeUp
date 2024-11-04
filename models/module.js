const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

module.exports = mongoose.model('Module', ModuleSchema);


