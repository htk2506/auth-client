import { SessionTokenPayload } from "./types";

const SESSION_TOKEN_LOCAL_STORAGE_KEY = 'session-token';

/**
 * Saves a session token for authentication.
 * @param sessionToken The token to save.
 */
export function setSessionToken(sessionToken: string): void {
    localStorage.setItem(SESSION_TOKEN_LOCAL_STORAGE_KEY, sessionToken);
}

/**
 * Retrieves the session token for authentication.
 * @returns The current session token if there is one and null otherwise.
 */
export function getSessionToken(): string | null {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
    if (sessionToken === null || sessionToken.trim().length === 0) { return null; }
    return sessionToken;
}

/**
 * Retrieves the payload of the current session token.
 * @returns The current session token's paylaod if there is one and null otherwise.
 */
export function getSessionTokenPayload(): SessionTokenPayload | null {
    const sessionToken = getSessionToken();
    if (sessionToken === null) { return null }
    return JSON.parse(Buffer.from(sessionToken.split('.')[1], 'base64').toString());
}

/**
 * Retrieves the expiration timestamp of the current session token.
 * @returns The current session token's expiration timestamp if there is one and null otherwise.
 */
export function getSessionTokenExpiration(): Date | null {
    const sessionTokenPayload = getSessionTokenPayload();
    if (sessionTokenPayload === null) { return null }
    // exp property of the token payload is in seconds and needs to convert to milliseconds
    const expirationTimestamp = new Date(sessionTokenPayload.exp * 1000);
    return expirationTimestamp;
}

/**
 * Checks if there is a session token that is not expired. 
 * Note that a client's unexpired session token is not necessarily valid.
 * @returns True if there is an unexpired session token and false otherwise.
 */
export function hasUnexpiredSessionToken(): boolean {
    const sessionTokenExpiration = getSessionTokenExpiration();
    if (sessionTokenExpiration == null) { return false }

    const currentTimestamp = new Date();
    return (currentTimestamp < sessionTokenExpiration);
}