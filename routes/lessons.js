const express = require("express");
const router = express.Router();
const Lesson = require("../models/lesson");
const Course = require("../models/course");

// Route to render the "Create Lesson" form
router.get("/create", (req, res) => {
    const courseId = req.query.courseId; // Get moduleId from query parameters
    if (!courseId) {
        return res.status(400).send("Course ID is required to create a lesson.");
    }
    // res.render("lessons/create", { courseId });
    res.send(courseId);
});

// Route to handle form submission and create a new lesson
router.post("/create", async (req, res) => {
    try {
        const { title, courseId } = req.body;

        if (!courseId) {
            return res.status(400).send("Course ID is required to create a lesson.");
        }

        // Create a new Lesson document
        const lesson = new Lesson({
            title,
            courseId,
        });
        await lesson.save();

        // Add the created lesson's ID to the corresponding module's lessons array
        await Course.findByIdAndUpdate(courseId, {
            $push: { lessons: lesson._id },
        });

        res.redirect(`/courses/${courseId}`); // Redirect to the module view page
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create lesson. Please try again.");
    }
});

// Get Course Id by Lesson Id
router.get("/getCourseId/:id", async (req, res) => {
    const lessonId = req.params.id;
    const courseId = await Lesson.findById(lessonId).select("courseId");
    res.send(courseId)
});

module.exports = router;
