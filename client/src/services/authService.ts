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
