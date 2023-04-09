const { Sequelize } = require("sequelize");
const user: string = process.env.POSTGRES_USER || 'postgres';
const host: string = process.env.POSTGRES_HOST || 'localhost';
const database: string = process.env.POSTGRES_DB || 'postgres';
const password: string = process.env.POSTGRES_PASSWORD || '';
const port: number = Number(process.env.POSTGRES_PORT) || 5432;

const sequelize = new Sequelize(database, user, password,{host,dialect:database});
  
const dbConnection = async () => {
    try {
       await sequelize.authenticate();
       console.log("Connection has been established successfully.");
    } catch (error) {
       console.error("Unable to connect to the database:", error);
       throw error;
    }
};
module.exports =  { sq: sequelize, dbConnection };;