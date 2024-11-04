const mongoose = require('mongoose')
const Authschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    job_title: {
        type: String,
        default: ''
    },

    status: {
        type: String,
        default: 'suspended'
    },
    roles: {
        type: [String],
        default: ['user']
    },
    coursesCreated: {
        type: [String],
        default: []
    },
    coursesEnrolled: {
        type: [String],
        default: []
    },
    createdDate: {
        type: Date,
        required: true,
        default: () => new Date()
    },
})
module.exports = mongoose.model('auth', Authschema)

