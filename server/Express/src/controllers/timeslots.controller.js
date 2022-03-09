const TimeSlot = require('../models/timeslot');
const Application = require('../models/application');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    getAllBookedCompanySlots: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const application = await Application.findOne({company: company._id});
            const slots = await TimeSlot.find( {application: application._id} );
            res.status(200).json({ message: 'success', slots });
        });
    },
    bookSlot: async (req, res) => {
        errorHandler(req, res, async () => {
            const slot = await TimeSlot.create({ ...req.body } );
            res.status(200).json({ message: 'success', slot });
        });
    },
    getAllBookedSlotsDetails: async (req, res) => {
        errorHandler(req,res, async () => {
            const application = await Application.findOne({user: req.user._id});
            const slots = await TimeSlot.find( {application: application._id} );
            res.status(200).json({ message: 'success', slots });
        });
    },
};