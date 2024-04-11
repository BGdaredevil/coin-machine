import { IFormField } from "../../../utils/commonTypes";

export enum Actions {
    EMAIL = "email",
    PASSWORD = "password",
}

export interface IForm {
    email: IFormField;
    password: IFormField;
}

export interface IAction {
    type: `${Actions}`;
    payload?: string;
}

