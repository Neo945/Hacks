/* eslint-disable consistent-return */
const {Message} = require('../models/message');
const transporter = require('../config/mailer.config');

const {
    sendRequest,
    requestMessage,
    requestEvent,
} = require('../config/dialogflow.config');

module.exports = {
    saveRequestMessage: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const requestData = requestMessage(req.body.message, req.body.language);
        const response = await sendRequest(requestData);
        const message = await Message.create({
            ...req.body,
            user: req.user._id,
            response: response[0].queryResult.fulfillmentText,
        });
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
    getMessage: async (req, res) => {
        const messages = await Message.aggregate([{ $sample: { size: 10 } }]);
        res.send(messages);
    },
    getMessageEvent: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const requestData = requestEvent(req.body.event, req.body.language);
        const response = await sendRequest(requestData);

        const message = await Message.create({
            user: req.user._id,
            response: response[0].queryResult.fulfillmentText,
        });
        res.send({ message, user: req.user.username });
    },
};
