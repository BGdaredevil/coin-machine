import { IMachine } from "../../../utils/commonTypes";

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

const getChangeCoins = (machine: Omit<IMachine, "owner">, currentState: IForm) => {
    const valueToReturn = Math.round((currentState.insertedValue - currentState.total) * 100) / 100;
    let calculationValue = valueToReturn;

    const coinFieldNames = ["twoDCoin", "oneDCoin", "fiftyCCoin", "twentyCCoin", "tenCCoin", "fiveCCoin", "twoCCoin", "oneCCoin"] as const;

    const coinValues = coinFieldNames.map((field) => coinValueMap[field]);
    const machineAvailableCoins = coinFieldNames.map((field) => machine[field]);
    // const userGivenCoins = coinFieldNames.map((field) => currentState[field]);

    // machineAvailableCoins[0] = 0;
    // machineAvailableCoins[1] = 0;
    // machineAvailableCoins[2] = 0;
    // machineAvailableCoins[3] = 0;
    // machineAvailableCoins[4] = 0;
    // machineAvailableCoins[5] = 0;
    // machineAvailableCoins[6] = 0;
    // machineAvailableCoins[7] = 0;

    const neededCoins = new Array(coinValues.length).fill(0);

    for (let i = 0; i < coinValues.length; i++) {
        const currentCoinValue = coinValues[i];

        while (calculationValue >= currentCoinValue) {
            neededCoins[i] += 1;

            if (neededCoins[i] > machineAvailableCoins[i]) {
                neededCoins[i] -= 1;

                break;
            }

            calculationValue = Math.round((calculationValue - currentCoinValue) * 100) / 100;
        }
    }

    return {
        canReturnAllChange: calculationValue == 0,
        missingFunds: calculationValue,
        neededCoins: neededCoins
            .map((count, i) => ({
                count: count,
                coin: coinValues[i],
                field: coinFieldNames[i],
            }))
            .filter((e) => e.count > 0),
    };
};

export default {
    initialState,
    getChangeCoins,
    coinReducer,
};
