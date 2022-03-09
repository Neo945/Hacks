const mongoose = require('mongoose');

const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    notes: {
        type: String,
        trim: true,
        minlength: [10, 'Notes length less than 10'],
    },
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;