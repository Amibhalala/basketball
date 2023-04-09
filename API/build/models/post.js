"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [{
            type: mongoose_2.default.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Post", postSchema);
