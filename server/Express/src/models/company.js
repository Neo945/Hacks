const { isMobilePhone } = require('validator').default;
const { isURL } = require('validator').default;
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CompanySchema = new Schema({
    profileImage: {
        type: String,
        required: [true, 'Please provide an image'],
        trim: true,
        unique: true,
        validate: [isURL, 'Please provide a valid link'],
        default: 'http://via.placeholder.com/640x360',
    },
    name: {
        type: String,
        trim: true,
        unique: true,
        minlength: [5, 'Company name less than 5'],
    },
    description: {
        type: String,
        trim: true,
        minlength: [10, 'Bio length less than 10'],
    },
    raised: {
        type: Number,
        default: 0,
    },
    companySize: {
        type: String,
        min: ['1', 'Company size less than 1'],
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    website: {
        type: String,
        trim: true,
        unique: true,
        validate: [isURL, 'Invalid link'],
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        minLength: 12,
        validate: [isMobilePhone, 'Invalid Phone number'],
    },
}, {
    timestamps: true,
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;