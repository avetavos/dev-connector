"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const axios_1 = tslib_1.__importDefault(require("axios"));
const authentication_1 = tslib_1.__importDefault(require("../middlewares/authentication"));
const Profile_1 = tslib_1.__importDefault(require("../models/Profile"));
const User_1 = tslib_1.__importDefault(require("../models/User"));
const Profile_2 = tslib_1.__importDefault(require("../middlewares/validations/Profile"));
const Experience_1 = tslib_1.__importDefault(require("../middlewares/validations/Experience"));
const Education_1 = tslib_1.__importDefault(require("../middlewares/validations/Education"));
class ProfileController {
    constructor() {
        this.path = '/profile';
        this.router = express_1.Router();
        this.user = User_1.default;
        this.profile = Profile_1.default;
        this.myProfile = async (req, res) => {
            try {
                const profile = await this.profile
                    .findOne({ user: req.user })
                    .populate('users', ['name', 'avatar']);
                if (!profile) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Profile file not found' }] });
                }
                return res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.createAndUpdate = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { company, website, location, bio, status, github, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;
            const profileFields = {};
            if (company)
                profileFields.company = company;
            if (website)
                profileFields.website = website;
            if (location)
                profileFields.location = location;
            if (bio)
                profileFields.bio = bio;
            if (status)
                profileFields.status = status;
            if (github)
                profileFields.github = github;
            if (skills) {
                profileFields.skills = skills
                    .split(',')
                    .map((skill) => skill.trim());
            }
            profileFields.social = {};
            if (youtube)
                profileFields.social.youtube = youtube;
            if (twitter)
                profileFields.social.twitter = twitter;
            if (facebook)
                profileFields.social.facebook = facebook;
            if (linkedin)
                profileFields.social.linkedin = linkedin;
            if (instagram)
                profileFields.social.instagram = instagram;
            try {
                const profile = await this.profile.findOneAndUpdate({ user: req.user }, { $set: profileFields }, { new: true, upsert: true });
                res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
        };
        this.getAllProfiles = async (req, res) => {
            try {
                const profiles = await this.profile
                    .find()
                    .populate('users', ['name', 'avatar']);
                return res.json(profiles);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const profile = await this.profile
                    .findOne({ user: req.params.user_id })
                    .populate('users', ['name', 'avatar']);
                if (!profile) {
                    return res
                        .status(400)
                        .json({ msg: 'There is no profile for this user' });
                }
                return res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.deleteProfile = async (req, res) => {
            try {
                await this.profile.findOneAndRemove({ user: req.user });
                await this.user.findByIdAndDelete(req.user);
                return res.json({ msg: 'User deleted' });
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.addExperience = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, company, location, from, to, current, description } = req.body;
            const newExp = { title, company, location, from, to, current, description };
            try {
                const profile = await this.profile.findOne({ user: req.user });
                profile.experience.unshift(newExp);
                await profile.save();
                res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.removeExperience = async (req, res) => {
            try {
                const profile = await this.profile.findOne({ user: req.user });
                const removeIndex = profile.experience
                    .map((item) => item.id)
                    .indexOf(req.params.exp_id);
                profile.experience.splice(removeIndex, 1);
                await profile.save();
                return res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.addEducation = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { school, degree, fieldofstudy, from, to, current, description } = req.body;
            const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            };
            try {
                const profile = await this.profile.findOne({ user: req.user });
                profile.education.unshift(newEdu);
                await profile.save();
                return res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.removeEducation = async (req, res) => {
            try {
                const profile = await this.profile.findOne({ user: req.user });
                const removeIndex = profile.education
                    .map((item) => item.id)
                    .indexOf(req.params.edu_id);
                profile.education.splice(removeIndex, 1);
                await profile.save();
                return res.json(profile);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.github = async (req, res) => {
            try {
                axios_1.default
                    .get(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`)
                    .then(result => {
                    res.json(result.data);
                })
                    .catch(err => {
                    if (err.response.status === 404) {
                        return res.status(404).json({ msg: 'No Github profile found' });
                    }
                    return res.status(500).send('Server error');
                });
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.router.get(`${this.path}/me`, authentication_1.default, this.myProfile);
        this.router.post(this.path, authentication_1.default, Profile_2.default, this.createAndUpdate);
        this.router.get(this.path, this.getAllProfiles);
        this.router.get(`${this.path}/user/:user_id`, this.getProfile);
        this.router.delete(this.path, authentication_1.default, this.deleteProfile);
        this.router.put(`${this.path}/experience`, authentication_1.default, Experience_1.default, this.addExperience);
        this.router.delete(`${this.path}/experience/:exp_id`, authentication_1.default, this.removeExperience);
        this.router.put(`${this.path}/education`, authentication_1.default, Education_1.default, this.addEducation);
        this.router.delete(`${this.path}/education/:edu_id`, authentication_1.default, this.removeEducation);
        this.router.get(`${this.path}/github/:username`, this.github);
    }
}
exports.default = ProfileController;
