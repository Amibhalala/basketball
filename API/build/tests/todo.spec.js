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
const supertest = require('supertest');
require('dotenv').config("../../.env");
const token = `Basic ${process.env.ACCESS_TOKEN}`;
let todoId = null;
const Authorization = "Authorization";
describe("Testing the todo api", () => {
    it("should get posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest(process.env.API_URL).get('/todos')
            .set(Authorization, token);
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('todos');
    }));
    it('should return 400 if authorization header field is missed', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest(process.env.API_URL)
            .get(`/todos`)
            .expect(400);
    }));
    it("should create a new post", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const response = yield supertest(process.env.API_URL).post('/todo/create')
            .set(Authorization, token)
            .send({
            name: "todo1",
            description: "test",
            status: false,
            userId: String(process.env.USER_ID)
        });
        expect(response.status).toEqual(201);
        todoId = (_b = (_a = response === null || response === void 0 ? void 0 : response._body) === null || _a === void 0 ? void 0 : _a.todo) === null || _b === void 0 ? void 0 : _b._id;
    }));
    it("should update a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest(process.env.API_URL).put(`/todo/${todoId}/update`)
            .set(Authorization, token)
            .send({
            name: "todo2",
            description: "test2",
            status: true
        });
        expect(response.status).toEqual(200);
    }));
    it("should delete a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest(process.env.API_URL).delete(`/todo/${todoId}/delete`)
            .set(Authorization, token);
        expect(response.status).toEqual(200);
    }));
});
