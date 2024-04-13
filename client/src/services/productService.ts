import { endpoints } from "../config/apiEndpoints";
import { IApiProduct, IProuduct } from "../utils/commonTypes";
import ApiService from "./apiService";

export const createProduct = (dto: Omit<IProuduct, "id">): Promise<IProuduct> => {
    return ApiService.post(`${endpoints.productApi}/create`, dto);
};

export const updateProduct = (dto: IProuduct): Promise<IApiProduct> => {
    return ApiService.post(`${endpoints.productApi}/edit/${dto.id}`, dto);
};

export const listPersonalProducts = (config: RequestInit): Promise<IApiProduct[]> => {
    return ApiService.get(`${endpoints.productApi}/catalog`, config);
};

export const listPublicProducts = (personId: string, config: RequestInit): Promise<IApiProduct[]> => {
    const params = new URLSearchParams({ person: personId });

    return ApiService.get(`${endpoints.productApi}/catalog?${params.toString()}`, config);
};
