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
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodoByUserId = exports.getTodoById = exports.getAllTodos = exports.getCustomFilter = void 0;
const todo_1 = __importDefault(require("../../models/todo"));
const commonFunction_1 = require("../../utility/commonFunction");
const redis_1 = __importDefault(require("../../utility/redis"));
const getCustomFilter = (query) => {
    let match = {};
    const { name, status } = query;
    if (name) {
        match['name'] = { '$regex': name, '$options': 'i' };
    }
    if (status) {
        match['status'] = status === 'true';
    }
    return match;
};
exports.getCustomFilter = getCustomFilter;
const getAllTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req === null || req === void 0 ? void 0 : req.query;
        const match = (0, exports.getCustomFilter)(query);
        const pageOptions = {
            page: (query === null || query === void 0 ? void 0 : query.page) ? parseInt(query === null || query === void 0 ? void 0 : query.page) : 0,
            limit: (query === null || query === void 0 ? void 0 : query.limit) ? parseInt(query === null || query === void 0 ? void 0 : query.limit) : 0
        };
        const todos = yield todo_1.default.find(Object.assign({}, match)).limit(pageOptions.limit).skip(pageOptions.page * pageOptions.limit).sort({ name: 'asc' });
        res.status(200).json({ todos, page: query === null || query === void 0 ? void 0 : query.page, limit: query === null || query === void 0 ? void 0 : query.limit });
    }
    catch (error) {
        throw error;
    }
});
exports.getAllTodos = getAllTodos;
const getTodoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const todo = yield todo_1.default.findById({ _id: id });
        redis_1.default.set(id, JSON.stringify(todo), "ex", 15);
        res.status(200).json({ todo });
    }
    catch (error) {
        res.status(404).json({
            error: "404 todo not found",
        });
        throw error;
    }
});
exports.getTodoById = getTodoById;
const getTodoByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const todo = yield todo_1.default.find({ userId });
        res.status(200).json({ todo });
    }
    catch (error) {
        res.status(404).json({
            error: "404 todo not found",
        });
        throw error;
    }
});
exports.getTodoByUserId = getTodoByUserId;
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const todo = new todo_1.default({
            name: body.name,
            description: body.description,
            status: body.status,
            userId: body.userId
        });
        const newTodo = yield todo.save();
        const allTodos = yield todo_1.default.find();
        res
            .status(201)
            .json({ message: "Todo created", todo: newTodo, todos: allTodos });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.createTodo = createTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { params: { id }, body, } = req;
        const updateTodo = yield todo_1.default.findByIdAndUpdate({ _id: id }, body, { new: true });
        const allTodos = yield todo_1.default.find();
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        (0, commonFunction_1.validateAccess)(userId, (_b = updateTodo === null || updateTodo === void 0 ? void 0 : updateTodo.userId) === null || _b === void 0 ? void 0 : _b.toString(), res);
        res.status(200).json({
            message: "Todo updated",
            todo: updateTodo,
            todos: allTodos,
        });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong",
        });
        throw error;
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const deletedTodo = yield todo_1.default.findByIdAndRemove(req.params.id);
        if (deletedTodo) {
            const userId = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id;
            if (userId !== (deletedTodo === null || deletedTodo === void 0 ? void 0 : deletedTodo.userId.toString())) {
                res.status(401).json({
                    message: 'Unauthorized user!'
                });
            }
            const allTodos = yield todo_1.default.find();
            res.status(200).json({
                message: "Todo deleted",
                todo: deletedTodo,
                todos: allTodos,
            });
        }
        else {
            res.status(400).json({
                error: "Todo is not found",
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
exports.deleteTodo = deleteTodo;
