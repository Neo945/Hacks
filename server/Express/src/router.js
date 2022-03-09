const router = require('express').Router();

// Routes for the API (all the user routes are prefixed with /auth) Auth
router.use('/auth', require('./routes/user.routes'));
router.use('/timeslot', require('./routes/timeshots.routes'));
router.use('/message', require('./routes/message.routes'));

module.exports = router;
