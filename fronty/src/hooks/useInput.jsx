import React, { useState } from 'react';
import useLocalStorage from './useLocalStorage';

function useInput(key, initValue) {
    const [value, setValue] = useLocalStorage(key, initValue);

    const reset = () => {
        setValue(initValue);
    };

    const inputProps = {
        value,
        onChange: (e) => setValue(e.target.value),
    };

    return [value, inputProps, reset];
}

export default useInput;
