const mongoose = require('mongoose');

const Authschema = mongoose.Schema({
    googleId: { type: String}, 
    name: { type: String, required: true },
    email: { type: String, required: true},
    profilePicture: { type: String }, 
    status: { type: String, default: 'suspended' },
    roles: { type: [String], default: ['user'] },
    coursesCreated: { type: [String], default: [] },
    testCreated: { type: [String], default: [] },
    coursesEnrolled: { type: [String], default: [] },
    createdDate: { type: Date, required: true, default: () => new Date() },
});

module.exports = mongoose.model('auth', Authschema);
