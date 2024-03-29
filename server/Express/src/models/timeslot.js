const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeslotSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'Please provide a date'],
    },
    timeSlot: {
        type: String,
        required: [true, 'Please fill the slot'],
        enum: ['1', '2', '3', '4', '5'],
    },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: [true, 'Please provide an application'],
    },
    room: {
        type: String,
        required: [true, 'Please fill the room'],
        trim: true,
        minlength: [5, 'Room length less than 5'],
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
}, {
    timestamps: true,
});

const TimeSlot = mongoose.model('Timeslot', TimeslotSchema);

module.exports = TimeSlot;
