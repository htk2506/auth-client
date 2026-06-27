export interface SessionTokenPayload {
    aud: string;
    exp: number;
    iss: string;
    jti: string;
    sub: string;
}