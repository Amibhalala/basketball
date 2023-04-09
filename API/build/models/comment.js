"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createdBy: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Comment", commentSchema);
