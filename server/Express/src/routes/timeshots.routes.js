const router = require('express').Router();
const view = require('../controllers/timeslots.controller');
// const isa = require('../middleware/authCheck.middleware');

router.get('/get/company/booked', view.getAllBookedCompanySlots);
router.get('/get/booked', view.getAllBookedSlotsDetails);
router.get('/book', view.bookSlot);

module.exports = router;