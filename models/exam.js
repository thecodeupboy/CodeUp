const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],
  duration: {
    type: Number,  // Duration in seconds
    required: true
  },
  category: {
    type: String,  // e.g. "beginner", "intermediate", "hard"
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Exam', examSchema);
