const Exam = require("../../models/exam");
const Test = require("../../models/test");
const Question = require("../../models/question");

const resolvers = {
  Query: {
    exams: async () => await Exam.find().populate('tests'),
    exam: async (_, { id }) => await Exam.findById(id).populate('tests'),
    tests: async () => await Test.find().populate('questions'),
    test: async (_, { id }) => await Test.findById(id).populate('questions'),
    questions: async () => await Question.find(),
    question: async (_, { id }) => await Question.findById(id),
  },

  Mutation: {
    createExam: async (_, { tests, duration, category, description }) => {
      const exam = new Exam({ tests, duration, category, description });
      await exam.save();
      return exam;
    },

    updateExam: async (_, { _id, tests, duration, category, description }) => {
      const updatedExam = await Exam.findByIdAndUpdate(
        _id,
        { tests, duration, category, description },
        { new: true }
      );
      if (!updatedExam) throw new Error("Exam not found");
      return updatedExam;
    },

    deleteExam: async (_, { _id }) => {
      const deletedExam = await Exam.findByIdAndDelete(_id);
      if (!deletedExam) throw new Error("Exam not found");
      return deletedExam;
    },

    createTest: async (_, { questions, duration, category, description, type }) => {
      const test = new Test({ questions, duration, category, description, type });
      await test.save();
      return test;
    },

    updateTest: async (_, { _id, questions, duration, category, description, type }) => {
      const updatedTest = await Test.findByIdAndUpdate(
        _id,
        { questions, duration, category, description, type },
        { new: true }
      );
      if (!updatedTest) throw new Error("Test not found");
      return updatedTest;
    },

    deleteTest: async (_, { _id }) => {
      const deletedTest = await Test.findByIdAndDelete(_id);
      if (!deletedTest) throw new Error("Test not found");
      return deletedTest;
    },

    createQuestion: async (_, { text, type, category, options, answer, duration, testId }) => {
      const question = new Question({ text, type, category, options, answer, duration, testId });
      await question.save();
      return question;
    },

    updateQuestion: async (_, { _id, text, type, category, options, answer, duration }) => {
      const updatedQuestion = await Question.findByIdAndUpdate(
        _id,
        { text, type, category, options, answer, duration },
        { new: true }
      );
      if (!updatedQuestion) throw new Error("Question not found");
      return updatedQuestion;
    },

    deleteQuestion: async (_, { _id }) => {
      const deletedQuestion = await Question.findByIdAndDelete(_id);
      if (!deletedQuestion) throw new Error("Question not found");
      return deletedQuestion;
    },
  },

  // Resolvers for the relationships
  Exam: {
    tests: async (exam) => await Test.find({ _id: { $in: exam.tests } }),
  },

  Test: {
    questions: async (test) => await Question.find({ _id: { $in: test.questions } }),
  },

  Question: {
    test: async (question) => await Test.findById(question.testId),
  },
};

module.exports = resolvers;
