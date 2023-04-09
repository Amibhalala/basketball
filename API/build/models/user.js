"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBodyObject = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });
exports.userBodyObject = {
    email: 'string',
    password: 'string',
    required: ['email', 'password']
};
exports.default = (0, mongoose_1.model)("User", exports.userSchema);
