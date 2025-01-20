const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  duration: {
    type: Number,  // Duration in seconds
    required: true
  },
  type: {
    type: String,  // "subjective" or "objective"
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

module.exports = mongoose.model('Test', testSchema);
