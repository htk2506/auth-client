export interface PasswordResetRequestBody {
    email: string;
    password_reset_token: string;
    new_password: string;
}