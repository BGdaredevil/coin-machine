import { IFormField, IProuduct } from "../../utils/commonTypes";

enum Actions {
    NAME = "name",
    DESCRIPTION = "description",
    IMAGE_URL = "imageUrl",
    PRICE = "price",
    INVENTORY_COUNT = "inventoryCount",
    VALIDATE_FIELD = "validateField",
}

enum SpecialActions {
    VALIDATE_ALL = "validateAll",
    RESET = "reset",
}

export interface IForm {
    name: IFormField<string>;
    description: IFormField<string>;
    imageUrl: IFormField<string>;
    price: IFormField<number>;
    inventoryCount: IFormField<number>;
}

interface ISimpleAction {
    type: `${Actions}`;
    payload?: string;
}

interface IResetAction {
    type: `${SpecialActions}`;
    payload?: IProuduct;
}

export type IAction = ISimpleAction | IResetAction;
