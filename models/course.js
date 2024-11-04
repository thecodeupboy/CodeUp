const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
});

module.exports = mongoose.model('Course', courseSchema);
