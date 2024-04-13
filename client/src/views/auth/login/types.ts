import { IFormField } from "../../../utils/commonTypes";

export enum Actions {
    EMAIL = "email",
    PASSWORD = "password",
}

export interface IForm {
    email: IFormField<string>;
    password: IFormField<string>;
}

export interface IAction {
    type: `${Actions}`;
    payload?: string;
}
