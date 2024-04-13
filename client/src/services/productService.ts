import { endpoints } from "../config/apiEndpoints";
import { IProuduct } from "../utils/commonTypes";
import ApiService from "./apiService";

export const createProduct = (dto: Omit<IProuduct, "id">): Promise<IProuduct> => {
    return ApiService.post(`${endpoints.productApi}/create`, dto);
};
