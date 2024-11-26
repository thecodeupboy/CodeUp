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
        const { title, content, courseId } = req.body;

        if (!courseId) {
            return res.status(400).send("Course ID is required to create a lesson.");
        }

        // Create a new Lesson document
        const lesson = new Lesson({
            title,
            content,
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

// Route to show a specific lesson
router.get("/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate("topics");
        if (!lesson) {
            return res.status(404).send("Lesson not found.");
        }
        res.render("lessons/show", { lesson }); // Render lesson view
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving lesson.");
    }
});

// Route to view all lessons for a specific module
router.get("/module/:moduleId", async (req, res) => {
    try {
        const lessons = await Lesson.find({ moduleId: req.params.moduleId }).populate("topics");
        res.render("lessons/index", { lessons, moduleId: req.params.moduleId }); // Render list of lessons
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving lessons.");
    }
});

module.exports = router;
