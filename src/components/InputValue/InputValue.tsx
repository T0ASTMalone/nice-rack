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

  const handleClickValue = () => {
    setFocused(true);
    // TODO: see if there's a better way
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 10);
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      console.log('[InputValue] no value');
      setInputValue('');
      return;
    }

    if (isNaN(Number(e.target.value))) {
      return;
    }

    setInputValue(e.target.value);
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('[InputValue] enter pressed');
      if (isNaN(parseFloat(inputValue))) {
        onChange(parseFloat(value));
        setInputValue(value);
      } else {
        onChange(parseFloat(inputValue));
      }
      setFocused(false);
    }
  }

  console.log('[InputValue] min: ', min)
  console.log('[InputValue] max: ', max)

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
        {inputValue}
      </p>
    </div>
  )
}

export default InputValue
