const jwt = require('jsonwebtoken');
const { BaseUser } = require('../models/user');

async function UserAuthentication(req, res, next) {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, id) => {
            if (err) {
                console.log(err);
                req.user = null;
                next();
            } else {
                BaseUser.findOne({ user: id.id })
                    .then(async (user) => {
                        console.log();
                        req.user = user;
                        next();
                    })
                    .catch((erro) => console.log(erro));
            }
        });
    } else {
        req.user = null;
        next();
    }
}
module.exports = UserAuthentication;
