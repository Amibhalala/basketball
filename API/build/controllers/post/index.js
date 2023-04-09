"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.deletePost = exports.updatePost = exports.createPost = exports.getPostByUserId = exports.getPostById = exports.getAllPost = exports.getCustomFilter = void 0;
const post_1 = __importDefault(require("../../models/post"));
const comment_1 = __importDefault(require("../../models/comment"));
const commonFunction_1 = require("../../utility/commonFunction");
const getCustomFilter = (query) => {
    let match = {};
    const { title, text } = query;
    if (title) {
        match['title'] = { '$regex': title, '$options': 'i' };
    }
    if (text) {
        match['text'] = { '$regex': text, '$options': 'i' };
    }
    return match;
};
exports.getCustomFilter = getCustomFilter;
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req === null || req === void 0 ? void 0 : req.query;
        const match = (0, exports.getCustomFilter)(query);
        const pageOptions = {
            page: (query === null || query === void 0 ? void 0 : query.page) ? parseInt(query === null || query === void 0 ? void 0 : query.page) : 0,
            limit: (query === null || query === void 0 ? void 0 : query.limit) ? parseInt(query === null || query === void 0 ? void 0 : query.limit) : 0
        };
        const posts = yield post_1.default.find(Object.assign({}, match)).limit(pageOptions.limit).skip(pageOptions.page * pageOptions.limit).sort({ createdAt: -1 });
        res.status(200).json({ posts, page: query === null || query === void 0 ? void 0 : query.page, limit: query === null || query === void 0 ? void 0 : query.limit });
    }
    catch (error) {
        res.status(400).json({
            error: "404 posts are not found",
        });
        throw error;
    }
});
exports.getAllPost = getAllPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield post_1.default.findById({ _id: id });
        res.status(200).json({ post });
    }
    catch (error) {
        res.status(404).json({
            error: "404 post not found",
        });
        throw error;
    }
});
exports.getPostById = getPostById;
const getPostByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const post = yield post_1.default.find({ createdBy: userId });
        res.status(200).json({ post });
    }
    catch (error) {
        res.status(404).json({
            error: "404 post not found",
        });
        throw error;
    }
});
exports.getPostByUserId = getPostByUserId;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const post = new post_1.default({
            title: body.title,
            text: body.text,
            createdBy: body.createdBy
        });
        const newPost = yield post.save();
        const allPost = yield post_1.default.find();
        res
            .status(201)
            .json({ message: "Post created", post: newPost, posts: allPost });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { params: { id }, body, } = req;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updatePost = yield post_1.default.findByIdAndUpdate({ _id: id }, body, { new: true });
        (0, commonFunction_1.validateAccess)(userId, updatePost === null || updatePost === void 0 ? void 0 : updatePost.createdBy.toString(), res);
        const allPost = yield post_1.default.find();
        res.status(200).json({
            message: "Post updated",
            post: updatePost,
            posts: allPost,
        });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const deletedPost = yield post_1.default.findByIdAndRemove(req.params.id);
        if (deletedPost) {
            const userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id;
            (0, commonFunction_1.validateAccess)(userId, (_c = deletedPost === null || deletedPost === void 0 ? void 0 : deletedPost.createdBy) === null || _c === void 0 ? void 0 : _c.toString(), res);
            const allPost = yield post_1.default.find();
            res.status(200).json({
                message: "Post deleted",
                post: deletedPost,
                posts: allPost,
            });
        }
        else {
            res.status(400).json({
                error: "post is not found",
            });
        }
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.deletePost = deletePost;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const id = (_d = req.params) === null || _d === void 0 ? void 0 : _d.id;
        const body = req.body;
        const comment = new comment_1.default({
            text: body.text,
            createdBy: body.createdBy,
            post: id
        });
        const newComment = yield comment.save();
        let post = yield post_1.default.findById({ _id: id });
        post === null || post === void 0 ? void 0 : post.comments.push(comment);
        const updatedPost = yield post.save();
        res
            .status(201)
            .json({ message: "Comment created", comment: newComment, post: updatedPost });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.createComment = createComment;
