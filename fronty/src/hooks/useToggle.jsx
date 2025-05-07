import React from 'react';
import useLocalStorage from './useLocalStorage';

function useToggle(key, initValue) {
    const [value, setValue] = useLocalStorage(key, initValue);

    const toggle = (newValue) => {
        setValue((prev) => (typeof newValue === 'boolean' ? newValue : !prev));
    };

    return [value, toggle];
}

export default useToggle;
