import { OAuth2Client } from 'google-auth-library';

//Stores the OAuth2Client instance to be reused in the required scripts
//TODO: make dependency injection
let authClient: OAuth2Client;

export function getClient(): OAuth2Client {
    return authClient;
}

export function setClient(newClient: OAuth2Client): OAuth2Client {
    authClient = newClient;
    return authClient;
}