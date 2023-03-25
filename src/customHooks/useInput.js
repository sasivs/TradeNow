import { useState } from "react";

export const useInput = (validator) => {
    const [enteredValue, setEnteredValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const {isValid, message} = validator(enteredValue);

    const hasError = !isValid && isTouched;

    const inputChangeHanlder = (event) => {
        setEnteredValue(event.target.value);
    }

    const inputOnBlurHandler = () => {
        setIsTouched(true);
    }

    const inputReset = () => {
        setEnteredValue('');
        setIsTouched(false);
    }

    return {
        value: enteredValue, hasError, isTouched, isValid, inputChangeHanlder, inputOnBlurHandler, inputReset, message: message
    }
}


