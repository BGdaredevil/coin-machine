import { IFormField } from "../../../utils/commonTypes";

export enum Actions {
    EMAIL = "email",
    PASSWORD = "password",
}

enum ValidateActions {
    VALIDATE_FIELD = "validateField",
}

export interface IForm {
    email: IFormField<string>;
    password: IFormField<string>;
}

interface IFormInputAction {
    type: `${Actions}`;
    payload?: string;
}

interface IFormValidateAction {
    type: `${ValidateActions}`;
    payload: keyof IForm;
}

export type IAction = IFormInputAction | IFormValidateAction;
