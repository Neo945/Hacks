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
    noOfAvailabeSlots: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const availableSlots = 7 - await Application.find({company: company._id}).count();
            res.status(200).json({ message: 'success', availableSlots });
        });
    },
    getAvailableSlots: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const timeSlots = [1,2,3,4,5,6,7];
            const slots = await Application.find({company: company._id}).map(app => ({slots: app.timeslot, date: app.date, status: app.status})).filter(app => !timeSlots.includes(app.slots));
            res.status(200).json({ message: 'success', slots });
        });
    },
    getAllCompletedSlots: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const slots = await TimeSlot.find( {company: company._id} ).filter(slot => slot.status === 'Closed');
            res.status(200).json({ message: 'success', slots });
        });
    },
    getAllBookedOpenSlots: async (req, res) => {
        errorHandler(req, res, async () => {
            const {company} = req;
            const slots = await TimeSlot.find( {company: company._id} ).filter(slot => slot.status === 'Open');
            res.status(200).json({ message: 'success', slots });
        });
    },
};
