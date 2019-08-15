"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const gravatar_1 = tslib_1.__importDefault(require("gravatar"));
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const User_1 = tslib_1.__importDefault(require("../models/User"));
const Register_1 = tslib_1.__importDefault(require("../middlewares/validations/Register"));
const Login_1 = tslib_1.__importDefault(require("../middlewares/validations/Login"));
const authentication_1 = tslib_1.__importDefault(require("../middlewares/authentication"));
class AuthenticateController {
    constructor() {
        this.path = '/auth';
        this.router = express_1.Router();
        this.user = User_1.default;
        this.currentUser = async (req, res) => {
            await this.user
                .findById(req.user)
                .select('-password')
                .then(user => {
                return res.status(200).json(user);
            });
        };
        this.register = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, email, password } = req.body;
            await this.user.findOne({ email }).then(user => {
                if (user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'User already exists' }] });
                }
            });
            try {
                const avatar = gravatar_1.default.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const user = new this.user({
                    name,
                    email,
                    password,
                    avatar
                });
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(password, salt);
                user.save();
                return res.status(200).json(user);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).json({ errors: [{ msg: 'Server error' }] });
            }
        };
        this.login = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            try {
                const user = await this.user.findOne({ email });
                if (!user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid credentials' }] });
                }
                const isMatch = await bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid Credentials' }] });
                }
                const payload = {
                    user: user.id
                };
                jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
                    if (err)
                        throw err;
                    return res.status(200).json({ token });
                });
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).json({ errors: [{ msg: 'Server error' }] });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, authentication_1.default, this.currentUser);
        this.router.post(`${this.path}/register`, Register_1.default, this.register);
        this.router.post(`${this.path}/login`, Login_1.default, this.login);
    }
}
exports.default = AuthenticateController;
