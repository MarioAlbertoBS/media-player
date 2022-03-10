import { drive_v3, google } from 'googleapis';

import { getClient } from '../services/authService';

//TODO: Resolve invalid_grant error when trying to access in the OAuth, must generate another new token

let driveClient: drive_v3.Drive;
let musicFolderId: string;

//We get the OAuth2Client instance, if not we create a new one
function setDriveClient(): boolean {
    //Get the client exist
    const oAuth2Client = getClient();
    //If we have no client, we have an error and cannot access to the resource
    if (!oAuth2Client) return false;
    //Set the client
    driveClient = google.drive({version: 'v3', auth: oAuth2Client});
    return true;
}

//List all files
async function listFiles(query: string, fields: string = 'files(id, name)'): Promise<drive_v3.Schema$FileList | undefined> {
    if (setDriveClient()) {
        try {
            const response = await driveClient.files.list({
                q: query,
                fields: fields
            });
            return response.data;
        } catch (error) {
            console.error(`Error getting files: ${error}`);
        }
    }
}

//Open a file by its Google Drive ID and return it as a stream, to be procesed
export async function getFile(fileId: string): Promise<any> {
    if (setDriveClient()) {
        try {
            const fileData = await driveClient.files.get({
                fileId: fileId,
                alt: 'media'
            }, {responseType: "stream"});
            if (fileData) {
                return fileData.data;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }
}

//Search the main music folder
export async function getMusicFolder(): Promise<string> {
    if (setDriveClient()) {
        try {
            const query = `mimeType="application/vnd.google-apps.folder" and name="music" and "root" in parents`;
            const fields = `files(id, name, parents)`;
            const response = await listFiles(query, fields);
            if (response) {
              const files = response.files;
              if (files?.length) {
                    //If we have multiple music folder, take only the first one
                    musicFolderId = files[0].id?.toString() ?? '';
                } else {
                    console.log("Not Music Folder in Root");
                }
            }
        } catch (error) {
            console.log(`Error in GD API: ${error}`);
        }
    }
    return "";
}

//List all the songs in the music folder
export async function getAllSongs(): Promise<drive_v3.Schema$File[] | undefined> {
    if (setDriveClient()) {
        if (musicFolderId && musicFolderId.length > 0) {
            try {
                const query = `(mimeType="audio/mpeg" or mimeType="application/vnd.google-apps.folder") and "${musicFolderId}" in parents`;
                const fields = `files(id, name, parents, fileExtension, fullFileExtension)`;
                const response = await listFiles(query, fields);
                const songs: drive_v3.Schema$File[] = [];
                if (response) {
                    const files = response.files;
                    files?.map(file => {
                        if (file.fileExtension == "mp3") {
                            songs.push(file);
                        }
                    });
                    return songs;
                } else {
                    console.log("No Files Found");
                }
            } catch (error) {
                console.log(`Error in GD API: ${error}`);
            }
        }
    }
}