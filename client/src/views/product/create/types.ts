import { IFormField } from "../../../utils/commonTypes";

export enum Actions {
    NAME = "name",
    DESCRIPTION = "description",
    IMAGE_URL = "imageUrl",
    PRICE = "price",
    INVENTORY_COUNT = "inventoryCount",
    VALIDATE = "validate",
    RESET = "reset",
}

export interface IForm {
    name: IFormField<string>;
    description: IFormField<string>;
    imageUrl: IFormField<string>;
    price: IFormField<number>;
    inventoryCount: IFormField<number>;
}

export interface IAction {
    type: `${Actions}`;
    payload?: string;
}
