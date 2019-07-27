const express = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const auth = require('../middlewares/authentication/auth');
const postValidator = require('../middlewares/validations/post');
const commentValidator = require('../middlewares/validations/comment');

const router = express.Router();

// Route:::   POST api/posts
// Desc:::    Create a post
// Access:::  Private
router.post('/', [auth, postValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id);
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   GET api/posts
// Desc:::    Get all post
// Access:::  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   GET api/posts/:id
// Desc:::    Get post by id
// Access:::  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).sort({ date: -1 });
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route:::   DELETE api/posts/:id
// Desc:::    Delete post by id
// Access:::  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route:::   PUT api/posts/like/:id
// Desc:::    Like post
// Access:::  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.send(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   PUT api/posts/unlike/:id
// Desc:::    Unlike post
// Access:::  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.params.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   POST api/posts/comment/:id
// Desc:::    Comment a post
// Access:::  Private
router.post('/comment/:id', [auth, commentValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route:::   DELETE api/posts/comment/:id/:comment_id
// Desc:::    Delete comment from post
// Access:::  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      item => item.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const removeIndex = post.comments
      .map(item => item.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
