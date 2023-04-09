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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlayer = exports.createPlayer = exports.getPlayers = void 0;
const Player = require('../../models/player');
const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: players } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, players, totalPages, currentPage };
};
const getPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(Number.parseInt(page), Number.parseInt(size));
    Player.findAndCountAll({ limit, offset, order: [
            ['player_id', 'ASC'],
        ], })
        .then((data) => {
        const result = getPagingData(data, page, limit);
        res.status(200).json(result);
    })
        .catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving players."
        });
    });
});
exports.getPlayers = getPlayers;
const createPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const body = req.body;
        if (!req.body.name) {
            res.status(400).send({
                message: "Content create empty data!"
            });
            return;
        }
        const player = {
            name: body === null || body === void 0 ? void 0 : body.name,
            height: (_a = body === null || body === void 0 ? void 0 : body.height) !== null && _a !== void 0 ? _a : null,
            width: (_b = body === null || body === void 0 ? void 0 : body.width) !== null && _b !== void 0 ? _b : null,
            college: (_c = body === null || body === void 0 ? void 0 : body.college) !== null && _c !== void 0 ? _c : null,
            born: (_d = body === null || body === void 0 ? void 0 : body.born) !== null && _d !== void 0 ? _d : null,
            birth_city: (_e = body === null || body === void 0 ? void 0 : body.birth_city) !== null && _e !== void 0 ? _e : null,
            birth_state: (_f = body === null || body === void 0 ? void 0 : body.birth_state) !== null && _f !== void 0 ? _f : null,
            year_start: (_g = body === null || body === void 0 ? void 0 : body.year_start) !== null && _g !== void 0 ? _g : null,
            year_end: (_h = body === null || body === void 0 ? void 0 : body.year_end) !== null && _h !== void 0 ? _h : null,
            position: (_j = body === null || body === void 0 ? void 0 : body.position) !== null && _j !== void 0 ? _j : null,
            weight: (_k = body.weight) !== null && _k !== void 0 ? _k : null,
            birth_date: (_l = body === null || body === void 0 ? void 0 : body.birth_date) !== null && _l !== void 0 ? _l : null
        };
        Player.create(player)
            .then((data) => {
            res.status(201).send({
                status: "success",
                message: "player created!",
                player: data
            });
        });
    }
    catch (error) {
        res.status(400).json({
            error: "Some error occurred while creating the player.",
        });
        throw error;
    }
});
exports.createPlayer = createPlayer;
const deletePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const playerId = Number.parseInt((_m = req === null || req === void 0 ? void 0 : req.params) === null || _m === void 0 ? void 0 : _m.id);
        if (!playerId) {
            res.status(400).send({
                message: "Player Id is required!"
            });
            return;
        }
        Player.destroy({
            where: { player_id: playerId }
        })
            .then((status) => {
            if (status == 1) {
                res.status(201).json({
                    status: "success",
                    message: "Player was deleted successfully!"
                });
            }
            else {
                res.status(201).json({
                    status: "fail",
                    message: `Cannot delete Player with id=${playerId}. Maybe Player was not found!`
                });
            }
        });
    }
    catch (error) {
        res.status(400).json({
            error: "Error in deleting Player",
        });
        throw error;
    }
});
exports.deletePlayer = deletePlayer;
