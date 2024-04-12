import { endpoints } from "../config/apiEndpoints";
import { IUserDto, IUserResponse } from "../utils/commonTypes";
import ApiService from "./apiService";

export const registerUser = (userDto: IUserDto): Promise<IUserResponse> => {
    return ApiService.post(`${endpoints.userApi}/register`, userDto);
};

export const loginUser = (userDto: Omit<IUserDto, "repeatPassword">): Promise<IUserResponse> => {
    return ApiService.post(`${endpoints.userApi}/login`, userDto);
};

export const getUserData = (userId: IUserResponse["id"], config: RequestInit): Promise<IUserResponse> => {
    return ApiService.get(`${endpoints.userApi}/${userId}`, config);
};

export const serverLogout = (): Promise<void> => ApiService.get(`${endpoints.userApi}/logout`);
