import express from "express";
import { Application } from "express";
import bodyParser from "body-parser";
import path from 'path';

import router from "./routes";
import middlewares from "./middlewares";

const app: Application = express();
const port: number =  5000;
const staticPath: string = "../dist/index.html";

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist/app.js')));

router(app, middlewares);

app.listen(port, () => {
    console.log(`App is running in port ${port}`);
});