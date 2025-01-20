const express = require("express");
const { gql } = require("apollo-server-express");
const Course = require("../models/course");
const Lesson = require("../models/lesson");
const Topic = require("../models/topic");
const multer = require("multer");

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
  }
`;

const resolvers = {
  Query: {
    courses: async () => {
      return await Course.find();
    },
    course: async (_, { id }) => {
      return await Course.findById(id).populate({
        path: "lessons",
        select: "title _id",
        populate: {
          path: "topics",
          select: "title _id",
        },
      });
    },
  },

  Mutation: {
    createCourse: async (_, { title, sDescription, lDescription, thumbnail }) => {
      const course = new Course({
        title,
        sDescription,
        lDescription,
        thumbnail,
      });
      await course.save();
      return course;
    },

    updateCourse: async (_, { _id, title, sDescription, lDescription, thumbnail }) => {
      try {
        const updatedCourse = await Course.findByIdAndUpdate(
          _id,
          { title, sDescription, lDescription, thumbnail },
          { new: true }
        );

        if (!updatedCourse) {
          throw new Error("Course not found");
        }

        return updatedCourse;
      } catch (error) {
        throw new Error("Error updating course: " + error.message);
      }
    },

    deleteCourse: async (_, { _id }) => {
      try {
        const deletedCourse = await Course.findByIdAndDelete(_id);
        if (!deletedCourse) {
          throw new Error("Course not found");
        }

        // Optionally, you can also delete associated lessons and topics.
        // Deleting lessons and topics to ensure there is no orphaned data.
        // await Lesson.deleteMany({ courseId: _id });
        // await Topic.deleteMany({ courseId: _id });

        return deletedCourse;
      } catch (error) {
        throw new Error("Error deleting course: " + error.message);
      }
    },
  },

  Course: {
    lessons: async (course) => {
      return await Lesson.find({ courseId: course._id });
    },
  },

  Lesson: {
    topics: async (lesson) => {
      return await Topic.find({ lessonId: lesson._id });
    },
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/thumbnails");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = { typeDefs, resolvers };
