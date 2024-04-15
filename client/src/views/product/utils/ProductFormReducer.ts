import { IProuduct } from "../../../utils/commonTypes";
import { URL_PATTERN } from "../../../utils/validatorConstants";
import validators from "../../../utils/validators";
import { IAction, IForm } from "../types";

const initialEmptyForm: IForm = {
    name: { value: "", error: false, touched: false, errorMessage: "" },
    description: { value: "", error: false, touched: false, errorMessage: "" },
    imageUrl: { value: "", error: false, touched: false, errorMessage: "" },
    price: { value: 0, error: false, touched: false, errorMessage: "" },
};

const getInitForm = () => {
    return {
        name: { ...initialEmptyForm.name },
        description: { ...initialEmptyForm.description },
        imageUrl: { ...initialEmptyForm.imageUrl },
        price: { ...initialEmptyForm.price },
    };
};

const formReducer = (state: IForm, action: IAction): IForm => {
    switch (action.type) {
        case "name": {
            const nextFieldState: IForm["name"] = { ...state.name, error: false, errorMessage: "" };
            nextFieldState.value = action.payload!;

            return { ...state, name: nextFieldState };
        }

        case "description": {
            const nextFieldState: IForm["description"] = { ...state.description, error: false, errorMessage: "" };
            nextFieldState.value = action.payload!;

            return { ...state, description: nextFieldState };
        }

        case "imageUrl": {
            const nextFieldState: IForm["imageUrl"] = { ...state.imageUrl, error: false, errorMessage: "" };
            nextFieldState.value = action.payload!;

            return { ...state, imageUrl: nextFieldState };
        }

        case "price": {
            const nextFieldState: IForm["price"] = { ...state.price, error: false, errorMessage: "" };
            nextFieldState.value = Number(action.payload!);

            return { ...state, price: nextFieldState };
        }

        case "validateAll": {
            const nextState = { ...state };

            validators.required(nextState.name, "Name is required");
            validators.minLength(nextState.name, "Name is too short", 2);
            validators.required(nextState.description, "Description is required");
            validators.minLength(nextState.description, "Description is too short", 10);
            validators.required(nextState.imageUrl, "Image URL is required");
            validators.isNotPattern(nextState.imageUrl, "Please enter a valid URL", URL_PATTERN);
            validators.required(nextState.price, "Price is required");
            validators.min(nextState.price, "Price should be a positive number", 0);

            return nextState;
        }

        case "validateField": {
            switch (action.payload) {
                case "name": {
                    const nextState = { ...state.name };
                    validators.required(nextState, "Name is required");
                    validators.minLength(nextState, "Name is too short", 2);

                    return { ...state, name: nextState };
                }

                case "description": {
                    const nextState = { ...state.description };
                    validators.required(nextState, "Description is required");
                    validators.minLength(nextState, "Description is too short", 10);

                    return { ...state, description: nextState };
                }

                case "imageUrl": {
                    const nextState = { ...state.imageUrl };
                    validators.required(nextState, "Image URL is required");
                    validators.isNotPattern(nextState, "Please enter a valid URL", URL_PATTERN);

                    return { ...state, imageUrl: nextState };
                }

                case "price": {
                    const nextState = { ...state.price };
                    validators.required(nextState, "Price is required");
                    validators.min(nextState, "Price should be a positive number", 0);

                    return { ...state, price: nextState };
                }

                default:
                    return state;
            }
        }

        case "reset": {
            const blankStrField = { value: "", error: false, touched: false, errorMessage: "" };
            const blankNumberField = { value: 0, error: false, touched: false, errorMessage: "" };
            const actionPayload = action.payload as IProuduct | undefined;

            return {
                description: { ...blankStrField, value: actionPayload?.description || "" },
                imageUrl: { ...blankStrField, value: actionPayload?.imageUrl || "" },
                name: { ...blankStrField, value: actionPayload?.name || "" },
                price: { ...blankNumberField, value: actionPayload?.price || 0 },
            };
        }

        default:
            return state;
    }
};

export default {
    getInitForm,
    formReducer,
};
