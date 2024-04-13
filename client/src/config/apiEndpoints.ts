const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3030";

export const endpoints = {
    userApi: `${baseUrl}/user`,
    productApi: `${baseUrl}/product`,
    machineApi: `${baseUrl}/machine`,
};
