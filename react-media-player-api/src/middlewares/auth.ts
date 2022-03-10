import { Request, Response } from 'express';

import { loadStorageAccess } from "../helpers/authHelper";
import { getClient } from '../services/authService';

async function isAuthenticated(req: Request, res: Response, next: Function) {
    if (getClient()) {
        next();
    } else {
        const authenticationObject = await loadStorageAccess();
        if (authenticationObject) {
            //Catch if the authentication object is string, we need to send the url
            if (typeof authenticationObject == 'string') {
                return res.status(200).send({
                    status: '2',
                    data: authenticationObject.toString()
                });
            }
            next();
        } else {
            return res.status(500).send({
                status: '1',
                data: 'Could not authenticate the user'
            });
        }
    }
}

export default isAuthenticated;