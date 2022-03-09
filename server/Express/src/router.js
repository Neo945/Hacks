const router = require('express').Router();

// Routes for the API (all the user routes are prefixed with /auth) Auth
router.use('/auth', require('./routes/user.routes'));

module.exports = router;
