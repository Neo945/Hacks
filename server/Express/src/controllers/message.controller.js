/* eslint-disable consistent-return */
const {Message} = require('../models/message');
const {Room} = require('../models/room');
const transporter = require('../config/mailer.config');

const {
    sendRequest,
    requestMessage,
    requestEvent,
} = require('../config/dialogflow.config');

module.exports = {
    createRoom: async (req, res) => {
        const room = Room.create({ ...req.body});
        room.users.push(req.user);
        await room.save();
        res.status(200).json({ message: 'success', room });
    },
    getAllRooms: async (req, res) => {
        const rooms = await Room.find({ users: req.user._id });
        res.status(200).json({ message: 'success', rooms });
    },
    saveRequestMessage: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const requestData = requestMessage(req.body.message, req.body.language);
        const { room, company } = req.body;
        const response = await sendRequest(requestData);
        const message = await Message.create({
            ...req.body,
            user: req.user._id,
            response: response[0].queryResult.fulfillmentText,
        });
        await Room.findByIdAndUpdate(room, { $push: { messages: message._id } });
        if (
            response[0].queryResult.action === 'fill.form' &&
      response[0].queryResult.allRequiredParamsPresent
        ) {
            const {email} = req.user;
            // eslint-disable-next-line no-shadow
            const message = `<h1>Thank you for reaching out</h1>
                    <p>We will contact you soon!!</p>`;
            console.log(await transporter(email, 'Chabot Feedback', message));
        } else if (
            response[0].queryResult.action === 'add.items' &&
      response[0].queryResult.allRequiredParamsPresent
        ) {
            const product =
        response[0].queryResult.parameters.fields.item.stringValue;

            return res.send({ message, user: req.user.username, product });
        } else if (
            response[0].queryResult.action === 'remove.items' &&
      response[0].queryResult.allRequiredParamsPresent
        ) {
            const Removeproduct =
        response[0].queryResult.parameters.fields.item.stringValue;

            return res.send({ message, user: req.user.username, Removeproduct });
        }
        res.send({ message, user: req.user.username });
    },
    getRoomMessages: async (req, res) => {
        const room = await Room.findById(req.params.id).populate('messages');
        res.send({ messages: room.messages });
    },
    getMessageEvent: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const requestData = requestEvent(req.body.event, req.body.language);
        const response = await sendRequest(requestData);
        const { room, company } = req.body;

        const message = await Message.create({
            user: req.user._id,
            response: response[0].queryResult.fulfillmentText,
        });
        await Room.findByIdAndUpdate(room, { $push: { messages: message._id } });

        res.send({ message, user: req.user.username });
    },
};
