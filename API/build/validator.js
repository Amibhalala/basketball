"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParam = void 0;
const validateParam = (req, res, next) => {
    var _a;
    if (!((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(400).json({ error: 'Param is required' });
    }
    next();
};
exports.validateParam = validateParam;
