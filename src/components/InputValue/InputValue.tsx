import React, { useEffect, useRef, useState } from 'react';
import Constants from '../../constants';
import './InputValue.css';

interface InputValueProps {
  value: string;
  step: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
}

function InputValue({ value, step, min, max, onChange }: InputValueProps) {
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value);
  }, [value])

  useEffect(() => {
    inputRef?.current?.focus();
  }, [focused]);

  const handleClickValue = () => {
    setFocused(true);
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setInputValue('');
      return;
    }

    if (isNaN(Number(e.target.value))) {
      return;
    }

    setInputValue(e.target.value);
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setFocused(false);
      setInputValue(value);
      return;
    }

    if (e.key !== 'Enter') {
      return;
    }

    if (isNaN(parseFloat(inputValue))) {
      onChange(parseFloat(value));
      setInputValue(value);
    } else {
      onChange(parseFloat(inputValue));
    }
    setFocused(false);
  }

  return (
    <div 
      className="input-value__container"
      onClick={handleClickValue}
    > 
      <input 
        ref={inputRef}
        step={step}
        min={(min === Constants.NODE_MIN_VALUE 
          ? Constants.MIN_VALUE 
          : min
        )}
        max={(max === Constants.NODE_MAX_VALUE 
          ? Constants.MAX_VALUE 
          : max 
        )}
        type="number"
        className={`input-value__input ${focused ? 'focused' : ''}`}
        value={inputValue}
        onKeyUp={onKeyPress}
        onChange={onInputChange}
      /> 
      <p className={`input-value__value ${focused ? '' : 'focused'}`}>
        {parseFloat(inputValue)?.toFixed(2)}
      </p>
    </div>
  )
}

export default InputValue
