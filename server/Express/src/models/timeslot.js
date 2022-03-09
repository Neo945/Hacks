const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeslotSchema = new Schema({
    slot: {
        type: String,
        required: [true, 'Please fill the slot'],
        trim: true,
        minlength: [5, 'Slot length less than 5'],
        enum: ['1', '2', '3', '4', '5'],
        isSlotAvailable: {
            type: Boolean,
            default: true,
            validate: {
                validator: function (value) {
                    return value === true;
                }
            }
        },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

const Timeslot = mongoose.model('Timeslot', TimeslotSchema);

module.exports = Timeslot;
