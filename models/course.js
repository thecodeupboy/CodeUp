const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: String,
    sDescription: String,
    lDescription: String,
    thumbnail: String,
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
});

module.exports = mongoose.model("Course", courseSchema);
