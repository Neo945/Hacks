const mongoose = require('mongoose');

const { Schema } = mongoose;

const EducationSchema = new Schema({
    degree: {
        type: String,
        required: [true, 'Please fill the degree'],
        trim: true,
        minlength: [5, 'Degree length less than 5'],
    },
    fieldOfStudy: {
        type: String,
        required: [true, 'Please fill the field of study'],
        trim: true,
        minlength: [5, 'Field of study length less than 5'],
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
});

const Education = mongoose.model('Education', EducationSchema);

module.exports = Education;