import { useState, useEffect } from 'react';

const getLocalValue = (key, initValue) => {
    // Handle SSR (Server-Side Rendering) for Next.js
    if (typeof window === 'undefined') return initValue;

    // Check if a value exists in local storage
    const localValue = localStorage.getItem(key);
    if (localValue !== null) return JSON.parse(localValue);

    // If initValue is a function, return its result
    return initValue instanceof Function ? initValue() : initValue;
};

function useLocalStorage(key, initValue) {
    const [value, setValue] = useState(() => getLocalValue(key, initValue));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;
