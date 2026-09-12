export interface CreateUserRequestBody {
    username: string,
    email: string | null,
    password: string,
    note: string,
}