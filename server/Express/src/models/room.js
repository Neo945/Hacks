const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoomSchema = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
