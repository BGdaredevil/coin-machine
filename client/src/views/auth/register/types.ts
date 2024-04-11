import { IFormField } from "../../../utils/commonTypes";

export enum Actions {
    EMAIL = "email",
    PASSWORD = "password",
    REPEAT_PASSWORD = "repeatPassword",
}

export interface IForm {
    email: IFormField;
    password: IFormField;
    repeatPassword: IFormField;
}

export interface IAction {
    type: `${Actions}`;
    payload?: string;
}
