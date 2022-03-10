import { Application } from "express";
import { Middlewares } from "../middlewares";

import { setToken } from "./controllers/authController";
import { getFiles } from "./controllers/storageController";
import { loadSong } from "./controllers/mediaController";

const router = (app: Application, {isAuthenticated}: Middlewares) => {
    app.post('/auth', setToken);
    app.get('/files', isAuthenticated, getFiles);
    app.get('/media/:songId', isAuthenticated, loadSong);
}

export default router;