const mongoose = require('mongoose');

const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    recruite: {
        type: Schema.Types.ObjectId,
        ref: 'Recruite',
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
    },
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;