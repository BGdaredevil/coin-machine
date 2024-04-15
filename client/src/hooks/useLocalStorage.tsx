import { useCallback, useEffect, useState } from "react";

type UseLocalStorage = <T = any>(
    key: string,
    defaultValue: T
) => {
    value: T | undefined;
    setStorageValue: (newValue: T) => void;
    clearStorage: () => void;
};

export const useLocalStorage: UseLocalStorage = <T = any,>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T | undefined>(() => {
        const storedData = localStorage.getItem(key);

        return storedData ? JSON.parse(storedData) : defaultValue;
    });

    const setStorageValue = useCallback(
        (newValue: T) => {
            localStorage.setItem(key, JSON.stringify(newValue));

            setValue(newValue);
        },
        [key]
    );

    const clearStorage = useCallback(() => {
        localStorage.removeItem(key);

        setValue(undefined);
    }, [key]);

    useEffect(() => {
        const storedData = localStorage.getItem(key);
        setValue(storedData ? JSON.parse(storedData) : defaultValue);
    }, [key]);

    return {
        value,
        setStorageValue,
        clearStorage,
    };
};
