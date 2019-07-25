const express = require('express');
const { validationResult } = require('express-validator');
const axios = require('axios');
const auth = require('../middlewares/authentication/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');
const profileValidator = require('../middlewares/validations/profile');
const experienceValidator = require('../middlewares/validations/experience');
const educationValidator = require('../middlewares/validations/education');

const router = express.Router();

// Route:::   GET api/profile/me
// Desc:::    Get current user profile
// Access:::  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'Profile file not found' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status('500').send('Server error');
  }
});

// Route:::   POST api/profile/
// Desc:::    Create and update profile
// Access:::  Private
router.post('/', [auth, profileValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route:::   GET api/profile/
// Desc:::    Get all profiles
// Access:::  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   GET api/profile/:user_id
// Desc:::    Get profile by user id
// Access:::  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.status(500).send('Server error');
  }
});

// Route:::   DELETE api/profile
// Desc:::    Delete profile, user and post
// Access:::  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    // await Profile.findByIdAndRemove({ user: req.user.id });
    res.send({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   PUT api/profile/experience
// Desc:::    Add profile experience
// Access:::  Private
router.put('/experience', [auth, experienceValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, company, location, from, to, current, description } = req.body;
  const newExp = { title, company, location, from, to, current, description };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   DELETE api/profile/experience/:edu_id
// Desc:::    Delete profile experience by id
// Access:::  Private
router.delete('/experience/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   PUT api/profile/education
// Desc:::    Add profile education
// Access:::  Private
router.put('/education', [auth, educationValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;
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
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu);
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   DELETE api/profile/education/:edu_id
// Desc:::    Delete profile education by id
// Access:::  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   GET api/profile/github/:username
// Desc:::    Get user repos from Github
// Access:::  Public
router.get('/github/:username', (req, res) => {
  try {
    axios
      .get(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`
      )
      .then(result => {
        res.send(result.data);
      })
      .catch(err => {
        if (err.response.status === 404) {
          return res.status(404).json({ msg: 'No Github profile found' });
        }
        res.status(500).send('Server error');
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
