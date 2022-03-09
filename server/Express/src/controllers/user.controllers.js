const { Recruite, Recruiter, BaseUser } = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');
const transport = require('../config/mailer.config');
const { URL } = require('../server');
const { uploadSingleImage } = require('../config/s3.config');
const Company = require('../models/company');
const Application = require('../models/application');

module.exports = {
    getUser: (req, res) => {
        errorHandler(req, res, async () => {
            const user = await Recruite.findOne({ user: req.user._id }).populate('BaseUser', '-password');
            res.status(200).json({ message: 'success', user });
        });
    },
    createUserForExistingBaseUser: (req, res) => {
        errorHandler(req, res, async () => {
            uploadSingleImage(req, res, async (err) => {
                const user = await BaseUser.findOne({ email: req.body.email });
                if (user) {
                    return res.status(400).json({ message: 'User already exist' });
                }
                if (err) return res.status(500).json({ error: err });
                if (!req.body.isReqcruiter) {
                    const newUserAccount = await Recruite.create({
                        ...req.body,
                        user: user._id,
                        image: req.file.location,
                    });    
                    return res.status(201).json({ message: 'success', user: { ...newUserAccount, password: null } });
                } 
                const newUserAccount = await Recruiter.create({
                    ...req.body,
                    user: user._id,
                    image: req.file.location,
                    company: req.body.company._id,
                });
                return res.status(201).json({ message: 'success', user: { ...newUserAccount, password: null } });
            });
        });
    },
    updatePassword: (req, res) => {
        errorHandler(req, res, async () => {
            const { oldPassword, newPassword } = req.body;
            if (req.user.isVerified) {
                if (await BaseUser.updatePassword(req.user._id, oldPassword, newPassword))
                    return res.status(200).json({ message: 'success' });
                return res.status(400).json({ message: 'old password is not correct' });
            }
            return res.status(400).json({ message: 'old password is not correct' });
        });
    },
    login: (req, res) => {
        errorHandler(req, res, async () => {
            const { password, email } = req.body;
            const token = await BaseUser.login(email, password);
            if (token) {
                res.cookie('jwt', token, {
                    maxAge: require('../config/config').TOKEN_LENGTH,
                });
                res.status(201).json({ mesage: 'login Successful' });
            } else {
                res.clearCookie('jwt');
                res.json({ mesage: 'User not found' });
            }
        });
    },
    logout: (req, res) => {
        errorHandler(req, res, () => {
            try {
                req.logout();
            } catch (err) {
                console.log(err);
            }
            res.clearCookie('jwt');
            res.json({ mesage: 'Logged out successfully' });
        });
    },
    googleOauthRedirect: (req, res) => {
        res.redirect(`${URL}/register/form`);
    },
    sendEmailVerfication: async (req, res) => {
        errorHandler(req, res, async () => {
            /**
             * send token[:3] as the room to join
             */
            const token = await BaseUser.generateEmailVerificationToken(req.user ? req.user._id : req.body._id);
            if (token) {
                const url = `${URL}/verify/${token}`;
                const message = `<h1>Please verify your email</h1>
                    <p>Click on the link below to verify your email</p>
                    <a href="${url}">${url}</a>`;
                transport(req.user.email, 'Email Verification', message);
                res.json({ message: 'success' });
            } else {
                res.json({ message: 'Unable to generate token', room: token.slice(token.length - 4) });
            }
        });
    },
    verifyEmailToken: async (req, res) => {
        errorHandler(req, res, async () => {
            const { token } = req.body;
            const isVerified = await BaseUser.verifyEmailToken(req.user._id, token);
            if (isVerified) {
                res.json({ message: 'Email varified!! Now go back and complete teh form' });
            } else {
                res.json({ message: 'Email not verified' });
            }
        });
    },
    emailVerificationRedirct: async (req, res) => {
        res.redirect('http://localhost:3000/verify');
    },
    createCompany: async (req, res) => {
        errorHandler(req, res, async () => {
            const user = Recruiter.findOne({ user: req.user._id });
            if (user) {
                const company = await Company.create({ ...req.body, user: req.user._id });
                res.status(201).json({ message: 'success', company });
            } else {
                res.status(400).json({ message: 'User is not a recruiter' });
            }
        });
    },
    sendJoinRequest: async (req, res) => {
        errorHandler(req, res, async () => {
            if (req.user) {
                const { recruite } = req.body;
                const token = await BaseUser.generateEmailVerificationToken(req.user ? req.user._id : req.body._id);
                if (token) {
                    const url = `${URL}/join?token=${token}&c=${req.body.company._id}`;
                    const message = `<h1>Please Join using and select the time slot</h1>
                        <p>Click on the link below to verify your email</p>
                        <a href="${url}">${url}</a>`;
                    transport(recruite.email, 'Email Join', message);
                    res.json({ message: 'Email send' });
                } else {
                    res.json({ message: 'Unable to generate token', room: token.slice(token.length - 4) });
                }
            } else {
                res.json({ message: 'User not found' });
            }
        });
    },
    joinRequestRedirect: async (req, res) => {
        errorHandler(req, res, async () => {
            const { token, c } = req.query;
            if (await BaseUser.verifyEmailToken(req.user._id, token)) {
                await Application.create({
                    recruite: req.user._id,
                    company: c,
                });
                res.redirect('http://localhost:3000/join');
            } else {
                res.json({ message: 'Token is not valid' });
            }
        });
    },
};
