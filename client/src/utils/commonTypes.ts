export interface IFormField<T> {
    value: T;
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
    token: string;
}

export interface IProuduct {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    inventoryCount: number;
}

export interface IApiProduct {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    inventoryCount: number;
    owner: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IMachine {
    name: string;
}
