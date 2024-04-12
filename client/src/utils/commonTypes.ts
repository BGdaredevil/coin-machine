export interface IFormField {
    value: string;
    error: boolean;
    touched: boolean;
    errorMessage: string;
}

export interface IUserDto {
    email: string;
    password: string;
    repeatPassword: string;
}

export interface IUserResponse {
    id: string;
    email: string;
}
