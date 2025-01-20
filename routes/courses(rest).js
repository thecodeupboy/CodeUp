const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/thumbnails");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });


router.get("/", async (req, res) => {

    const courses = await Course.find();
    // res.render("courses/allCourses", { courses });
    res.send(courses);
});


router.get("/create", (req, res) => {
    res.render("courses/create");
});


router.post("/create", upload.single("thumbnail"), async (req, res) => {
    const course = new Course({
        title: req.body.title,
        lDescription: req.body.lDescription,
        sDescription: req.body.sDescription,
        thumbnail: "thumbnails/" + req.file.filename,
    });
    await course.save();
    res.redirect("/courses");
});


router.get("/:id", async (req, res) => {
    const course = await Course.findById(req.params.id).populate({
        path: "lessons",
        select: "title _id", 
        populate: {
            path: "topics",
            select: "title _id", 
        },
    });
    // res.render("courses/show.ejs", { course });
    res.send(course);
});


router.get("/delete/:id", async (req, res, next) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    course.save();
    res.redirect("/courses");
});

module.exports = router;
