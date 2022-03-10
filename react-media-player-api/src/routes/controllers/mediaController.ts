import fs from 'fs';
import { Request, Response } from 'express';
import { getFile } from '../../helpers/storageHelper';

export async function loadSong(req: Request, res: Response){
    const startTime = performance.now();
    const songId = req.params.songId ?? '';
    
    if (songId.length > 0) {
        console.log("Requesting song");

        res.writeHead(206, {
            "Content-Type": "audio/mp3",
        });
        console.log(`Running Request: ${performance.now()-startTime}`);
        getFile(songId).then(data => {
            data?.pipe(res);
            console.log(`Sending Data: ${performance.now()-startTime}`);
            //Create a stream and send it to the response
        });
    }
    else return res.status(500).send("Something went wrong");
}