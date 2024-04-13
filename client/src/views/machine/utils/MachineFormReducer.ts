import { IProuduct } from "../../../utils/commonTypes";
import validators from "../../../utils/validators";
import { IAction, IForm } from "../types";

const initialEmptyForm: IForm = {
    name: { value: "", error: false, touched: false, errorMessage: "" },
};

const getInitForm = () => {
    return {
        name: { ...initialEmptyForm.name },
    };
};

const formReducer = (state: IForm, action: IAction): IForm => {
    switch (action.type) {
        case "name": {
            const nextFieldState: IForm["name"] = { ...state.name, error: false, errorMessage: "" };
            nextFieldState.value = action.payload!;

            return { ...state, name: nextFieldState };
        }

        case "validateAll": {
            const nextState = { ...state };

            validators.required(nextState.name, "Name is required");
            validators.minLength(nextState.name, "Name is too short", 2);

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

                default:
                    return state;
            }
        }

        case "reset": {
            const blankStrField = { value: "", error: false, touched: false, errorMessage: "" };

            const actionPayload = action.payload as IProuduct | undefined;

            return {
                name: { ...blankStrField, value: actionPayload?.name || "" },
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
