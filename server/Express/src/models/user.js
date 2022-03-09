const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator').default;
const { isMobilePhone } = require('validator').default;
const { isStrongPassword } = require('validator').default;
const { isURL } = require('validator').default;
const { wsServer } = require('../server');

const { Schema } = mongoose;

const BaseUserSchema = new Schema(
    {
        isVarified: {
            type: Boolean,
            default: false,
        },
        username: {
            type: String,
            required: [true, 'Please fill the username'],
            trim: true,
            minlength: 5,
        },
        password: {
            type: String,
            trim: true,
            required: [true, 'Please fill the password'],
            validate: [isStrongPassword, 'not a strong password'],
            minlength: [10, 'Password Length less than 10'],
        },
        email: {
            type: String,
            required: [true, 'Please fill the email'],
            unique: [true, 'Already have a account'],
            lowercase: true,
            trim: true,
            minlength: [10, 'Email Length less than 10'],
            validate: [isEmail, 'Invalid email'],
        },
    },
    {
        timestamps: true,
    }
);

BaseUserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

BaseUserSchema.post('save', (doc, next) => {
    console.log(doc);
    next();
});
function getToken(id) {
    // eslint-disable-next-line global-require
    return jwt.sign({ id }, require('../config/config').SECRET_KEY, {
        expiresIn: 3 * 24 * 3600,
    });
}
BaseUserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (await bcrypt.compare(password, user.password)) {
        return getToken(user._id);
    }
    return null;
};

BaseUserSchema.statics.generateEmailVerificationToken = async function (_id) {
    if (await this.exists({ _id })) {
        const token = await bcrypt.hash(_id.toString(), '$2b$10$q8FYXO/z.XXGEce05HIdce');
        return token;
    }
    return null;
};

BaseUserSchema.statics.verifyEmailToken = async function (id, token) {
    const user = await this.findById(id);
    if (await bcrypt.compare(token, user._id)) {
        user.isVerified = true;
        user.save();
        wsServer.on('connect', (connection) => {
            setTimeout(() => {
                connection.send({ success: true, message: 'Account verified' });
            }, 5000);
        });

        return true;
    }
    return false;
};

BaseUserSchema.statics.updatePassword = async function (id, oldPass, newPass) {
    const user = await this.findById(id);
    if (await bcrypt.compare(oldPass, user.password)) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPass, salt);
        await user.save();
        return true;
    }
    return false;
};

BaseUserSchema.statics.savePass = async function (username, password) {
    const user = await this.findOne({ username });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);
    user.save();
};

const RecruiteSchema = new Schema({
    profileImage: {
        type: String,
        required: [true, 'Please provide an image'],
        trim: true,
        unique: true,
        validate: [isURL, 'Please provide a valid link'],
        default: 'http://via.placeholder.com/640x360',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'BaseUser',
        required: [true, 'Please provide a user'],
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        minLength: 12,
        validate: [isMobilePhone, 'Invalid Phone number'],
    },
    age: {
        type: Number,
        min: [12, 'Grow Up'],
    },
    resume: {
        type: String,
        trim: true,
        unique: true,
        validate: [isURL, 'Invalid link'],
    },
    location: {
        type: String,
        trim: true,
        unique: true,
        enum: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain', 'Mumbai'],
    },
    skills: [{
        type: mongoose.Types.ObjectId,
        ref: 'Skill',
    }],
    bio: {
        type: String,
        trim: true,
        minlength: [10, 'Bio length less than 10'],
    },
    experience: [{
        type: mongoose.Types.ObjectId,
        ref: 'Experience',
    }],
    education: [{
        type: mongoose.Types.ObjectId,
        ref: 'Education',
    }],
}, {
    timestamps: true,
});

const RecruiterSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'BaseUser',
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        minLength: 12,
        validate: [isMobilePhone, 'Invalid Phone number'],
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please provide a company'],
    },
    location: {
        type: String,
        trim: true,
        unique: true,
        enum: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain', 'Mumbai'],
    },
    
}, {
    timestamps: true,
});

const BaseUser = mongoose.model('BaseUser', BaseUserSchema);
const Recruite = mongoose.model('Recruite', RecruiteSchema);
const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

module.exports = {
    BaseUser,
    Recruite,
    Recruiter,
};
