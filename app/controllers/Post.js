"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const User_1 = tslib_1.__importDefault(require("../models/User"));
const Post_1 = tslib_1.__importDefault(require("../models/Post"));
const authentication_1 = tslib_1.__importDefault(require("../middlewares/authentication"));
const Post_2 = tslib_1.__importDefault(require("../middlewares/validations/Post"));
const Comment_1 = tslib_1.__importDefault(require("../middlewares/validations/Comment"));
class PostController {
    constructor() {
        this.path = '/posts';
        this.router = express_1.Router();
        this.user = User_1.default;
        this.post = Post_1.default;
        this.createPost = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const user = await this.user.findById(req.user);
                const newPost = new this.post({
                    text: req.body.text,
                    name: user.name,
                    avatar: user.avatar,
                    user: req.user.toString()
                });
                const post = await newPost.save();
                return res.json(post);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.getAllPosts = async (req, res) => {
            try {
                const posts = await this.post.find().sort({ date: -1 });
                return res.json(posts);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.getPost = async (req, res) => {
            try {
                const post = await this.post.findById(req.params.id).sort({ date: -1 });
                if (!post) {
                    return res.status(404).json({ msg: 'Post not found' });
                }
                return res.json(post);
            }
            catch (err) {
                console.error(err.message);
                if (err.kind === 'ObjectId') {
                    return res.status(404).json({ msg: 'Post not found' });
                }
                return res.status(500).send('Server error');
            }
        };
        this.deletePost = async (req, res) => {
            try {
                const post = await this.post.findById(req.params.id);
                if (!post) {
                    return res.status(404).json({ msg: 'Post not found' });
                }
                if (post.user.toString() !== req.user.toString()) {
                    return res.status(401).json({ msg: 'User not authorized' });
                }
                await post.remove();
                return res.json({ msg: 'Post removed' });
            }
            catch (err) {
                console.error(err.message);
                if (err.kind === 'ObjectId') {
                    return res.status(404).json({ msg: 'Post not found' });
                }
                return res.status(500).send('Server error');
            }
        };
        this.likePost = async (req, res) => {
            try {
                const post = await this.post.findById(req.params.id);
                if (post.likes.filter((like) => like.user.toString() === req.user.toString()).length > 0) {
                    return res.status(400).json({ msg: 'Post already liked' });
                }
                post.likes.unshift({ user: req.user.toString() });
                await post.save();
                return res.send(post.likes);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.unlikePost = async (req, res) => {
            try {
                const post = await this.post.findById(req.params.id);
                const removeIndex = post.likes
                    .map((like) => like.user.toString())
                    .indexOf(req.params.id);
                post.likes.splice(removeIndex, 1);
                await post.save();
                return res.json(post);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.commentPost = async (req, res) => {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const user = await this.user.findById(req.user).select('-password');
                const post = await this.post.findById(req.params.id);
                const newComment = {
                    text: req.body.text,
                    name: user.name,
                    avatar: user.avatar,
                    user: req.user.toString()
                };
                post.comments.unshift(newComment);
                await post.save();
                return res.json(post.comments);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.removeComment = async (req, res) => {
            try {
                const post = await this.post.findById(req.params.id);
                const comment = post.comments.find(item => item.id === req.params.comment_id);
                if (!comment) {
                    return res.status(404).json({ msg: 'Comment does not exist' });
                }
                if (comment.user.toString() !== req.user.toString()) {
                    return res.status(401).json({ msg: 'User not authorized' });
                }
                const removeIndex = post.comments
                    .map(item => item.user.toString())
                    .indexOf(req.user.toString());
                post.comments.splice(removeIndex, 1);
                await post.save();
                return res.json(post.comments);
            }
            catch (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }
        };
        this.router.post(this.path, authentication_1.default, Post_2.default, this.createPost);
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPost);
        this.router.get(`${this.path}/:id`, this.getPost);
        this.router.delete(`${this.path}/:id`, authentication_1.default, this.deletePost);
        this.router.post(`${this.path}/like/:id`, authentication_1.default, this.likePost);
        this.router.put(`${this.path}/unlike/:id`, authentication_1.default, this.unlikePost);
        this.router.post(`${this.path}/comment/:id`, authentication_1.default, Comment_1.default, this.commentPost);
        this.router.delete(`${this.path}/comment/:id/:comment_id`, authentication_1.default, this.removeComment);
    }
}
exports.default = PostController;
