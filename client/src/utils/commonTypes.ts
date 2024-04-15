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
}

export interface IApiProduct {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    owner: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IItemAutoselect {
    _id: string;
    name: string;
}

export interface IInventroyItem {
    inventoryCount: 0;
    item: IApiProduct;
    _id: "661b8418cf85d43d974276df";
}

export interface IMachine {
    _id: string;
    name: string;
    owner: {
        _id: string;
        email: string;
    };
    oneCCoin: number;
    twoCCoin: number;
    fiveCCoin: number;
    tenCCoin: number;
    twentyCCoin: number;
    fiftyCCoin: number;
    oneDCoin: number;
    twoDCoin: number;
    inventory: IInventroyItem[];
    createdAt: string;
    updatedAt: string;
}

export interface ICoinsRefillDto {
    oneCCoin?: number;
    twoCCoin?: number;
    fiveCCoin?: number;
    tenCCoin?: number;
    twentyCCoin?: number;
    fiftyCCoin?: number;
    oneDCoin?: number;
    twoDCoin?: number;
}
