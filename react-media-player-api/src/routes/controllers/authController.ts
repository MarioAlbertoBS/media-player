import { Request, Response } from 'express';
import { setAccessToken } from '../../helpers/authHelper';

export async function setToken(req: Request, res: Response) {
    console.log(req.body);
    const accessToken = req.body.token ?? '';
    // return res.status(200).send(accessToken);
    if (accessToken) {
        const result = await setAccessToken(accessToken);
        if (result) {
            return res.status(200).send("Access Granted");
        }
        return res.status(200).send("Access Denied");
    }
    return res.status(200).send({data:"No Data"});
}