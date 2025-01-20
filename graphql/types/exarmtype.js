const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Exam {
    _id: ID!
    tests: [Test]
    duration: Int
    category: String
    description: String
  }

  type Test {
    _id: ID!
    questions: [Question]
    duration: Int
    type: String  # "subjective" or "objective"
    category: String
    description: String
  }

  type Question {
    _id: ID!
    text: String!
    type: String!  # "subjective" or "objective"
    category: String!
    options: [String]  # Only for objective questions
    answer: String  # Correct answer for objective questions
    duration: Int!  # Duration to answer the question in seconds
  }

  type Query {
    exams: [Exam]
    exam(id: ID!): Exam
    tests: [Test]
    test(id: ID!): Test
    questions: [Question]
    question(id: ID!): Question
  }

  type Mutation {
    createExam(
      tests: [ID]!
      duration: Int!
      category: String!
      description: String!
    ): Exam

    updateExam(
      _id: ID!
      tests: [ID]
      duration: Int
      category: String
      description: String
    ): Exam

    deleteExam(_id: ID!): Exam

    createTest(
      examId: ID!
      questions: [ID]!
      duration: Int!
      type: String!
      category: String!
      description: String!
    ): Test

    updateTest(
      _id: ID!
      examId: ID
      questions: [ID]
      duration: Int
      type: String
      category: String
      description: String
    ): Test

    deleteTest(_id: ID!): Test

    createQuestion(
      testId: ID!
      text: String!
      type: String!
      category: String!
      options: [String]
      answer: String
      duration: Int!
    ): Question

    updateQuestion(
      _id: ID!
      text: String
      type: String
      category: String
      options: [String]
      answer: String
      duration: Int
    ): Question

    deleteQuestion(_id: ID!): Question
  }
`;

module.exports = typeDefs;
