const mongoose = require('mongoose');

const { Schema } = mongoose;

const ExperienceSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please fill the title'],
        trim: true,
        minlength: [5, 'Title length less than 5'],
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Recruiter',
    },
    from: {
        type: Date,
        required: [true, 'Please fill the from date'],
    },
    to: {
        type: Date,
        required: [true, 'Please fill the to date'],
    },
    current: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: [true, 'Please fill the description'],
        trim: true,
        minlength: [10, 'Description length less than 10'],
    },
});

const Experience = mongoose.model('Experience', ExperienceSchema);

module.exports = Experience;