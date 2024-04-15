import { ReactNode } from "react";
import { ToastOptions, toast } from "react-toastify";

export function toastError(message: string | ReactNode, options?: ToastOptions) {
    return toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        ...options,
    } as ToastOptions);
}

export function toastSuccess(message: string | ReactNode, options?: ToastOptions) {
    return toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        ...options,
    } as ToastOptions);
}

export function toastWarning(message: string | ReactNode, options?: ToastOptions) {
    return toast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        ...options,
    } as ToastOptions);
}

export function toastInfo(message: string | ReactNode, options?: ToastOptions) {
    return toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        ...options,
    } as ToastOptions);
}
