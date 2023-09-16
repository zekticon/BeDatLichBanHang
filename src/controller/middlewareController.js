import { query } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(' ')[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(200).json({
                    errCode: 1,
                    errMessage: 'Token is not valid',
                });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(200).json("You're not authenticate");
    }
};

const verifyTokenAndAdminAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id == req.body.id || req.user.roleId === 'Admin') {
            next();
        } else {
            return res.status(200).json("You're not allowed to access permission");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdminAuth,
};
