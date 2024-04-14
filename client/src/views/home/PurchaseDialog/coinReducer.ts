const initialState = {
    productQuantity: 0,
    insertedValue: 0,
    productPrice: 0,
    total: 0,

    oneCCoin: 0,
    twoCCoin: 0,
    fiveCCoin: 0,
    tenCCoin: 0,
    twentyCCoin: 0,
    fiftyCCoin: 0,
    oneDCoin: 0,
    twoDCoin: 0,
};

const coinValueMap = {
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

const coinReducer = (state: IForm, action: IAction): IForm => {
    switch (action.type) {
        case "setCoin":
            const currentValue = state[action.payload.field] * coinValueMap[action.payload.field];
            const newValue = action.payload.count * coinValueMap[action.payload.field];
            const insertedValue = state.insertedValue - currentValue + newValue;

            // console.log(state[action.payload.field], coinValueMap[action.payload.field]);
            // console.log(action.payload.count, coinValueMap[action.payload.field]);
            // console.log(state.insertedValue, currentValue, newValue);
            // console.log(state.insertedValue - currentValue + newValue);

            return {
                ...state,
                [action.payload.field]: action.payload.count,
                insertedValue: Math.round(insertedValue * 100) / 100,
            };

        case "setProductQuantity": {
            const newQuantity = action.payload;
            const total = Math.round(state.productPrice * newQuantity * 100) / 100;

            return { ...state, productQuantity: newQuantity, total: total };
        }

        case "setPrice": {
            const total = Math.round(action.payload! * state.productQuantity * 100) / 100;

            return { ...state, productPrice: action.payload!, total: total };
        }

        case "reset":
            return { ...initialState, ...action.payload };

        default:
            return state;
    }
};

export default {
    initialState,
    coinReducer,
};
