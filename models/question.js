const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  text: {
    type: String,
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
  options: [{
    type: String
  }],
  answer: {
    type: String  // Correct answer for objective questions
  },
  duration: {
    type: Number,  // Duration to answer the question in seconds
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);
