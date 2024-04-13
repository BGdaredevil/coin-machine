import { IFormField } from "./commonTypes";

interface IValidatorFucntion<T> {
    (data: IFormField<T>, message: string, condition?: any): IFormField<T>;
}

const isPattern: IValidatorFucntion<string> = (data, message, pattern) => {
    if ((pattern as RegExp).test(data.value.trim())) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

const isNotPattern: IValidatorFucntion<string> = (data, message, pattern) => {
    if (!(pattern as RegExp).test(data.value.trim())) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

const required: IValidatorFucntion<any> = (data, message) => {
    if (!data.value) {
        data.error = true;
        data.errorMessage = message;
    }

    if (typeof data.value === "string" && !data.value.trim()) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

const minLength: IValidatorFucntion<string> = (data, message, length) => {
    if (data.value.trim().length < length) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

const maxLength: IValidatorFucntion<string> = (data, message, length) => {
    if (data.value.trim().length > length) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

const min: IValidatorFucntion<number> = (data, message, size) => {
    if (data.value < size) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

const max: IValidatorFucntion<number> = (data, message, size) => {
    if (data.value > size) {
        data.error = true;
        data.errorMessage = message;
    }

    return data;
};

export default {
    minLength,
    maxLength,
    required,
    min,
    max,
    isPattern,
    isNotPattern,
};
