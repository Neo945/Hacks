const TimeSlot = require('../models/timeslot');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    getAllBookedCompanySlots: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const slots = await TimeSlot.find( {company: company._id} );
            res.status(200).json({ message: 'success', slots });
        });
    },
    bookSlot: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const slot = await TimeSlot.create({company: company._id, ...req.body, user: req.user._id} );
            res.status(200).json({ message: 'success', slot });
        });
    },
    getAllBookedSlotsDetails: async (req, res) => {
        errorHandler(req,res, async () => {
            const slots = await TimeSlot.find( {user: req.user._id} );
            res.status(200).json({ message: 'success', slots });
        });
    },
};