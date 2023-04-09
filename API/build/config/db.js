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
const { Sequelize } = require("sequelize");
const user = process.env.POSTGRES_USER || 'postgres';
const host = process.env.POSTGRES_HOST || 'localhost';
const database = process.env.POSTGRES_DB || 'postgres';
const password = process.env.POSTGRES_PASSWORD || '';
const port = Number(process.env.POSTGRES_PORT) || 5432;
const sequelize = new Sequelize(database, user, password, { host, dialect: database });
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
});
module.exports = { sq: sequelize, dbConnection };
;
