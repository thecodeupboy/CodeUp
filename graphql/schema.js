const { gql } = require("apollo-server-express");
const courseTypeDefs = require("./types/courseType");
const userTypeDefs = require("./types/userType");
const examTypeDefs = require("./types/examType"); 
const courseResolvers = require("./resolvers/courseResolver");
const userResolvers = require("./resolvers/userResolver");
const examResolvers = require("./resolvers/examResolvers");  

const typeDefs = gql`
  ${courseTypeDefs}
  ${userTypeDefs}
  ${examTypeDefs}
`;

const resolvers = {
  Query: {
    ...courseResolvers.Query,
    ...userResolvers.Query,
    ...examResolvers.Query, 
  },
  Mutation: {
    ...courseResolvers.Mutation,
    ...userResolvers.Mutation,
    ...examResolvers.Mutation, 
  },
  Course: courseResolvers.Course,
  Lesson: courseResolvers.Lesson,
  Topic: courseResolvers.Topic,
  Exam: examResolvers.Exam, 
  Test: examResolvers.Test,  
  Question: examResolvers.Question, 
};

module.exports = { typeDefs, resolvers };
