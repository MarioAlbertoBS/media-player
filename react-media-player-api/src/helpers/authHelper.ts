import path from 'path';
import { google } from 'googleapis';
import { openFile, writeFile } from './filesHelper';

import { getClient, setClient } from '../services/authService';

interface CredentialsJSON {
    installed: {
        client_id: string,
        project_id: string,
        auth_uri: string,
        token_uri: string,
        auth_provider_x509_cert_url: string,
        client_secret: string,
        redirect_uris: string[]
    }
}

// If modifying these scopes, delete token.json
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time
const TOKEN_PATH = path.resolve(__dirname, '../../credentials/token.json');
// Google Drive OAuth2 app credentials
const CREDENTIALS_PATH = path.resolve(__dirname, '../../credentials/credentials.json');

async function loadAppCredentials(): Promise<CredentialsJSON | null>{
    // Load client secrets from a local file
    const credentials = await openFile(CREDENTIALS_PATH);
    if (credentials) {
        return JSON.parse(credentials);
    }
    return null;
}

async function authorize (credentials: CredentialsJSON): Promise<boolean> {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    let authClient = getClient();
    if (!authClient) {
        authClient = setClient(new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]));
    }

    // Check if we have previously stored a token
    let token = null;
    try {
        token = await openFile(TOKEN_PATH);
    } catch(error) {
        console.error(error);
    }
    if (!token) {
        return false;
    }
    authClient.setCredentials(JSON.parse(token));
    return true;
}

function generateAuthUrl(): string {
    const authClient = getClient();
    if (!authClient) {
        return '';
    }
    const authUrl: string = authClient.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    return authUrl;
}

export async function loadStorageAccess(): Promise<string | boolean>{
    const credentials = await loadAppCredentials();
    // console.log(typeof credentials, credentials);
    if (credentials) {
        const authorized = await authorize(credentials);
        if (!authorized) {
            const url = generateAuthUrl();
            return url;
        }
        return true;
    }
    return false
}

export async function setAccessToken(accessToken: string): Promise<boolean> {
    const authClient = getClient();
    if (!authClient) {
        return false;
    }
    await authClient.getToken(accessToken, (error, token) => {
        if (error) return console.error('Error retrieveing access token', error);
        if (token) {
            authClient.setCredentials(token);
            // Store the token to disk for later program executions
            writeFile(TOKEN_PATH, JSON.stringify(token));
        }
    });
    return true;
}