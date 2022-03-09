const mongoose = require('mongoose');

const { Schema } = mongoose;

const JobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please fill the title'],
        trim: true,
        minlength: [5, 'Title length less than 5'],
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
    },
    location: {
        type: String,
        trim: true,
        unique: true,
        enum: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain', 'Mumbai'],
    },
    description: {
        type: String,
        trim: true,
        minlength: [10, 'Bio length less than 10'],
    },
    stipend: {
        type: Number,
        required: [true, 'Please fill the stipend'],
    },
    experience: {
        type: Number,
        required: [true, 'Please fill the experience'],
    },
    skills: [{
        type: mongoose.Types.ObjectId,
        ref: 'Skill',
    }],
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;