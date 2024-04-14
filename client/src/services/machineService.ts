import { endpoints } from "../config/apiEndpoints";
import { IMachine } from "../utils/commonTypes";
import ApiService from "./apiService";

// todo fix typescript

export const createMachine = (dto: any): Promise<any> => {
    return ApiService.post(`${endpoints.machineApi}/create`, dto);
};

export const getPublicMachines = (config: RequestInit): Promise<any> => {
    return ApiService.get(`${endpoints.machineApi}/public-catalog`, config);
};

export const getMyMachines = (config: RequestInit): Promise<any> => {
    return ApiService.get(`${endpoints.machineApi}/catalog`, config);
};

export const getMachine = (id: string, config: RequestInit): Promise<any> => {
    return ApiService.get(`${endpoints.machineApi}/${id}`, config);
};

export const addProducts = (id: string, dto: any, config?: RequestInit): Promise<any> => {
    return ApiService.put(`${endpoints.machineApi}/inventory/${id}/add-products`, dto, config);
};

export const editMachineProducts = (id: string, dto: any, config?: RequestInit): Promise<any> => {
    return ApiService.put(`${endpoints.machineApi}/inventory/${id}/edit-machine-products`, dto, config);
};

export const updateMachine = (id: string, dto: Pick<IMachine, "name">): Promise<any> => {
    return ApiService.put(`${endpoints.machineApi}/edit/${id}`, dto);
};

export const getNotAssignedProducts = (machineId: string, config?: RequestInit): Promise<any> => {
    return ApiService.get(`${endpoints.machineApi}/inventory/${machineId}/not-products`, config);
};
