import { IFormField, IMachine } from "../../utils/commonTypes";

enum Actions {
    NAME = "name",
    VALIDATE_FIELD = "validateField",
}

enum SpecialActions {
    VALIDATE_ALL = "validateAll",
    RESET = "reset",
}

export interface IForm {
    name: IFormField<string>;
}

interface ISimpleAction {
    type: `${Actions}`;
    payload?: string;
}

interface IResetAction {
    type: `${SpecialActions}`;
    payload?: Pick<IMachine, "name">;
}

export type IAction = ISimpleAction | IResetAction;
