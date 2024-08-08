import { useEffect, useState } from 'react';

const useDebouncedValue = <T>(value: T, delayMs: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [debouncedValue, delayMs, value]);

    return debouncedValue;
};

export { useDebouncedValue };
