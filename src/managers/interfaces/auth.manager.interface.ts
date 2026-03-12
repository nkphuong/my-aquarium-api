export interface IRegisterCommand {
    email: string;
    password: string;
    name?: string;
}

export interface ILoginCommand {
    email: string;
    password: string;
}

export interface IRefreshTokenCommand {
    refreshToken: string;
}
