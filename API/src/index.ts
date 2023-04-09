import express, { Express } from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./utility/errorHandler";
const player = require("./models/player");
const { dbConnection } = require("./config/db");
const port: string | number = process.env.API_PORT || 8000;
const app: Express = express();
app.use(cors())
app.use(bodyParser.json());
app.use(errorHandler)
app.use(routes)
dbConnection()
player.sync();
app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
)

module.exports = app;