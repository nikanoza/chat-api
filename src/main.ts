import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./config/mongo.js";

dotenv.config();
connect();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 4444);
