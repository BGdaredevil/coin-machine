import { endpoints } from "../config/apiEndpoints";
import ApiService from "./apiService";

interface IUserDto {
    email: string;
    password: string;
    repeatPassword: string;
}

export const registerUser = (userDto: IUserDto) => {
    return ApiService.post(`${endpoints.userApi}/register`, userDto);
};

export const loginUser = (userDto: Omit<IUserDto, "repeatPassword">) => {
    return ApiService.post(`${endpoints.userApi}/login`, userDto);
};

export const serverLogout = () => ApiService.get(`${endpoints.userApi}/logout`);
