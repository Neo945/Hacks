const router = require('express').Router();
const view = require('../controllers/message.controller');

router.get('/create/room', view.createRoom);
router.get('/get/all/room', view.getAllRooms);
router.get('/get/all/room/message', view.getRoomMessages);
router.post('/send/room/message', view.saveRequestMessage);
router.post('/send/room/message/event', view.getMessageEvent);

module.exports = router;