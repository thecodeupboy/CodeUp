const Course = require("../../models/course");
const Lesson = require("../../models/lesson");
const Topic = require("../../models/topic");

const resolvers = {
  Query: {
    courses: async () => await Course.find(),
    course: async (_, { id }) => await Course.findById(id).populate({
      path: "lessons",
      select: "title _id",
      populate: {
        path: "topics",
        select: "title _id",
      },
    }),
  },

  Mutation: {
    createCourse: async (_, { title, sDescription, lDescription, thumbnail }) => {
      const course = new Course({ title, sDescription, lDescription, thumbnail });
      await course.save();
      return course;
    },

    updateCourse: async (_, { _id, title, sDescription, lDescription, thumbnail }) => {
      const updatedCourse = await Course.findByIdAndUpdate(_id, { title, sDescription, lDescription, thumbnail }, { new: true });
      if (!updatedCourse) throw new Error("Course not found");
      return updatedCourse;
    },

    deleteCourse: async (_, { _id }) => {
      const deletedCourse = await Course.findByIdAndDelete(_id);
      if (!deletedCourse) throw new Error("Course not found");
      return deletedCourse;
    },

    createLesson: async (_, { courseId, title }) => {
      const lesson = new Lesson({ title, courseId });
      await lesson.save();
      return lesson;
    },

    updateLesson: async (_, { _id, title }) => {
      const updatedLesson = await Lesson.findByIdAndUpdate(_id, { title }, { new: true });
      if (!updatedLesson) throw new Error("Lesson not found");
      return updatedLesson;
    },

    deleteLesson: async (_, { _id }) => {
      const deletedLesson = await Lesson.findByIdAndDelete(_id);
      if (!deletedLesson) throw new Error("Lesson not found");
      return deletedLesson;
    },

    createTopic: async (_, { lessonId, title, content, videoUrl }) => {
      const topic = new Topic({ lessonId, title, content, videoUrl });
      await topic.save();
      return topic;
    },

    updateTopic: async (_, { _id, title, content, videoUrl }) => {
      const updatedTopic = await Topic.findByIdAndUpdate(_id, { title, content, videoUrl }, { new: true });
      if (!updatedTopic) throw new Error("Topic not found");
      return updatedTopic;
    },

    deleteTopic: async (_, { _id }) => {
      const deletedTopic = await Topic.findByIdAndDelete(_id);
      if (!deletedTopic) throw new Error("Topic not found");
      return deletedTopic;
    },
  },

  Course: {
    lessons: async (course) => await Lesson.find({ courseId: course._id }),
  },

  Lesson: {
    topics: async (lesson) => await Topic.find({ lessonId: lesson._id }),
  },

  Topic: {
    lesson: async (topic) => await Lesson.findById(topic.lessonId),
  },
};

module.exports = resolvers;
