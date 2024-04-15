export const coinIterationHelper = [
    { field: "oneCCoin" as const, value: 0.01 },
    { field: "twoCCoin" as const, value: 0.02 },
    { field: "fiveCCoin" as const, value: 0.05 },
    { field: "tenCCoin" as const, value: 0.1 },
    { field: "twentyCCoin" as const, value: 0.2 },
    { field: "fiftyCCoin" as const, value: 0.5 },
    { field: "oneDCoin" as const, value: 1 },
    { field: "twoDCoin" as const, value: 2 },
];

export const coinValueMap = {
    oneCCoin: 0.01,
    twoCCoin: 0.02,
    fiveCCoin: 0.05,
    tenCCoin: 0.1,
    twentyCCoin: 0.2,
    fiftyCCoin: 0.5,
    oneDCoin: 1,
    twoDCoin: 2,
};

enum CoinNames {
    ONE_C_COIN = "oneCCoin",
    TWO_C_COIN = "twoCCoin",
    FIVE_C_COIN = "fiveCCoin",
    TEN_C_COIN = "tenCCoin",
    TWENTY_C_COIN = "twentyCCoin",
    FIFTY_C_COIN = "fiftyCCoin",
    ONE_D_COIN = "oneDCoin",
    TWO_D_COIN = "twoDCoin",
}

enum Actions {
    SET_COIN = "setCoin",
}

enum ProductActions {
    SET_PRODUCT_QUANTITY = "setProductQuantity",
    SET_PRICE = "setPrice",
}

enum SpecialActions {
    RESET = "reset",
}

export interface IForm {
    productQuantity: number;
    insertedValue: number;
    productPrice: number;
    total: number;

    oneCCoin: number;
    twoCCoin: number;
    fiveCCoin: number;
    tenCCoin: number;
    twentyCCoin: number;
    fiftyCCoin: number;
    oneDCoin: number;
    twoDCoin: number;
}

interface ISimpleAction {
    type: `${Actions}`;
    payload: { field: `${CoinNames}`; count: number };
}

interface IProductAction {
    type: `${ProductActions}`;
    payload: number;
}

interface IResetAction {
    type: `${SpecialActions}`;
    payload: {
        productPrice: number;
        productQuantity: number;
        total: number;
    };
}

export type IAction = ISimpleAction | IResetAction | IProductAction;
