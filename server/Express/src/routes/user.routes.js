const router = require('express').Router();
const view = require('../controllers/user.controllers');
const isa = require('../middleware/authCheck.middleware');
const passport = require('../config/passport.config');

router.get('/get', view.getUser);
router.get('/logout', isa, view.logout);
router.get('/send/email/', view.sendEmailVerfication);
router.get('/verify/email/', view.verifyEmailToken);
router.post('/register', view.register);
router.post('/update/password', view.updatePassword);
router.post('/login', view.login);
router.post('/create/company', view.createCompany);
router.post('/request/join', view.sendJoinRequest);
router.post('/join', view.sendJoinRequest);

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);
router.get('/google/redirect', passport.authenticate('google'), view.googleOauthRedirect);

module.exports = router;
