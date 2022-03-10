import { Request, Response } from 'express';
import { getMusicFolder, getAllSongs } from '../../helpers/storageHelper';

//List all the songs, export as controller method
export async function getFiles(req: Request, res: Response): Promise<Response> {
    await getMusicFolder();
    const songs = await getAllSongs();
    if (songs) {
        console.log(`Total songs: ${songs.length}`);
        return res.status(200).send({status: 1, data: songs});
    }
    return res.status(500).send("No music folder or it's empty");
}