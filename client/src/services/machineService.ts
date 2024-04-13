import { endpoints } from "../config/apiEndpoints";
import ApiService from "./apiService";

export const createMachine = (dto: any): Promise<any> => {
    return ApiService.post(`${endpoints.machineApi}/create`, dto);
};
