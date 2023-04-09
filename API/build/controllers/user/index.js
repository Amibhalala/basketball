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
exports.logout = exports.refreshToken = exports.login = exports.registerUser = exports.getAllUser = exports.getCustomFilter = void 0;
const user_1 = __importDefault(require("../../models/user"));
const redis_1 = __importDefault(require("../../utility/redis"));
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const getCustomFilter = (query) => {
    let match = {};
    const { name, email } = query;
    if (name) {
        match['name'] = { '$regex': name, '$options': 'i' };
    }
    if (email) {
        match['email'] = { '$regex': email, '$options': 'i' };
    }
    return match;
};
exports.getCustomFilter = getCustomFilter;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req === null || req === void 0 ? void 0 : req.query;
        const match = (0, exports.getCustomFilter)(query);
        const pageOptions = {
            page: (query === null || query === void 0 ? void 0 : query.page) ? parseInt(query === null || query === void 0 ? void 0 : query.page) : 0,
            limit: (query === null || query === void 0 ? void 0 : query.limit) ? parseInt(query === null || query === void 0 ? void 0 : query.limit) : 0
        };
        const users = yield user_1.default.find(Object.assign({}, match), { name: 1, email: 1 }).limit(pageOptions.limit).skip(pageOptions.page * pageOptions.limit).sort({ name: "asc" });
        res.status(200).json({ users, page: query === null || query === void 0 ? void 0 : query.page, limit: query === null || query === void 0 ? void 0 : query.limit });
    }
    catch (error) {
        throw error;
    }
});
exports.getAllUser = getAllUser;
const generateAccessToken = (id, email) => {
    if (email) {
        return jwt.sign({ id, email }, String(process.env.ACCESS_TOKEN_SECRET), {
            expiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN)
        });
    }
    throw new Error('Error creating token');
};
const generateRefreshToken = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (email) {
            const refreshToken = jwt.sign({ id, email }, String(process.env.REFRESH_TOKEN_SECRET), {
                expiresIn: String(process.env.REFRESH_TOKEN_EXPIRES_IN)
            });
            yield redis_1.default.set(id.toString(), refreshToken);
            return refreshToken;
        }
    }
    catch (error) {
        throw new Error('Error creating token');
    }
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existUser = yield user_1.default.findOne({ email: body.email });
        if (existUser) {
            res.status(409).json({
                error: "User already exist",
            });
        }
        var encryptedPassword = bcrypt.hashSync(body.password, 10);
        const user = new user_1.default({
            name: body.name,
            email: body.email,
            password: encryptedPassword
        });
        const newUser = yield user.save();
        res.status(200).send({ auth: true, id: newUser._id, email: body.email });
    }
    catch (error) {
        res.status(400).json({
            error: "Error in registering user",
        });
        throw error;
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield user_1.default.findOne({ email: body.email });
        const isValidPassword = user ? yield bcrypt.compare(body.password, user.password) : false;
        if (user && isValidPassword) {
            var accessToken = generateAccessToken(user._id, body.email);
            var refreshToken = yield generateRefreshToken(user._id, body.email);
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        }
        else {
            res.status(401).json({
                error: "Password is incorrect",
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
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, email, id } = req === null || req === void 0 ? void 0 : req.body;
        if (!token || !email || !id) {
            res.status(400).json({
                error: "Body paremeters are required",
            });
        }
        const refreshToken = yield redis_1.default.get(id);
        if (!refreshToken) {
            res.status(400).json({
                error: "Refresh token is invalid",
            });
            return;
        }
        const accessToken = generateAccessToken(id, email);
        const newRefreshToken = yield generateRefreshToken(id, email);
        yield redis_1.default.set(id.toString(), JSON.stringify(newRefreshToken));
        res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a["authorization"];
        const authToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        const { id } = req === null || req === void 0 ? void 0 : req.body;
        if (!id) {
            res.status(400).json({
                error: "Body paremeters are required",
            });
        }
        const refreshToken = yield redis_1.default.get(id.toString());
        if (authToken && refreshToken) {
            yield redis_1.default.set(id.toString(), null);
            res.status(200).json({
                message: "Logout successfully",
            });
        }
        else {
            res.status(400).json({
                message: "Error in logging out",
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
exports.logout = logout;
