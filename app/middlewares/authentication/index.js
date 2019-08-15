"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
async function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res
            .status(401)
            .json({ errors: [{ msg: 'No token, Authorization denied' }] });
    }
    try {
        const decoded = await jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (err) {
        return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
}
exports.default = authMiddleware;
