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