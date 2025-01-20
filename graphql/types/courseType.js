const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Course {
    _id: ID!
    title: String!
    sDescription: String!
    lDescription: String!
    thumbnail: String!
    lessons: [Lesson]
  }

  type Lesson {
    _id: ID!
    title: String!
    topics: [Topic]
  }

  type Topic {
    _id: ID!
    title: String!
    content: String!
    videoUrl: String!
    lesson: Lesson  # Add this line to define the lesson field in Topic
  }

  type Query {
    courses: [Course]
    course(id: ID!): Course
  }

  type Mutation {
    createCourse(
      title: String!
      sDescription: String!
      lDescription: String!
      thumbnail: String!
    ): Course

    updateCourse(
      _id: ID!
      title: String
      sDescription: String
      lDescription: String
      thumbnail: String
    ): Course

    deleteCourse(_id: ID!): Course

    createLesson(courseId: ID!, title: String!): Lesson
    updateLesson(_id: ID!, title: String): Lesson
    deleteLesson(_id: ID!): Lesson

    createTopic(
      lessonId: ID!
      title: String!
      content: String!
      videoUrl: String!
    ): Topic

    updateTopic(_id: ID!, title: String, content: String, videoUrl: String): Topic
    deleteTopic(_id: ID!): Topic
  }
`;

module.exports = typeDefs;
