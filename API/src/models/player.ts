const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const Player = sq.define("player", {
    player_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
    },
    height: {
        type: DataTypes.INTEGER,
    },
    width: {
        type: DataTypes.INTEGER,
    },
    college: {
        type: DataTypes.TEXT,
    },
    born: {
        type: DataTypes.INTEGER,
    },
    birth_city: {
        type: DataTypes.TEXT,
    },
    birth_state: {
        type: DataTypes.TEXT,
    },
    year_start: {
        type: DataTypes.INTEGER,
    },
    year_end: {
        type: DataTypes.INTEGER,
    },
    position: {
        type: DataTypes.TEXT,
    },
    weight: {
        type: DataTypes.INTEGER,
    },
    birth_date: {
        type: DataTypes.DATE,
    }
    },{freezeTableName:true, timestamps: false});
module.exports = Player;