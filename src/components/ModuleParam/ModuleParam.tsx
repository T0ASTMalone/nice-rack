import { useMemo, useState } from "react";
import { motion } from 'framer-motion';
import { useMinMax, useStep } from "../../hooks/ModuleHooks";
import { IONode, ParamOptions, RackAudioNode } from "../../types/RackTypes";
import InputValue from "../InputValue/InputValue";

import { ModuleIO } from "../ModuleIO";
import Constants from "../../constants";
// @ts-ignore
import { Knob } from 'react-rotary-knob';

import skin from '../../assets/skins/knob1';

import './ModuleParma.css';

interface ModuleParamProps<T extends RackAudioNode> {
  name: string; 
  param: AudioParam | string;
  onChange?: (name: string, val: number | string) => void;
  types?: string[];
  input?: IONode<T>[];
  value?: number;
  onClick: (name: string) => void;
  options?: ParamOptions,
  nodeId: string,
}

export default function ModuleParam<T extends RackAudioNode>({ 
  name, param, onChange, onClick, types, input, value, options, nodeId,
}: ModuleParamProps<T>) {
  const [type, setType] = useState<string>(typeof param === 'string' ? param : '');
  const step = useStep(param);
  const { min, max } = useMinMax(name, param, options);

  const step2 = useMemo(() => {
    if (name !== 'frequency') {
      return step;
    }
    if (typeof value === 'number') { 
      if (value > 1000) {
        return 100
      }
      return 1
    }
    return 1;
  }, [value, step])

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => { 
    setType(e.target.value);
    onChange?.(name, e.target.value);
  }

  const handleKnobChange = (val: number) => {
    onChange?.(name, val);
  }
  if (typeof value === 'number') {
    console.log(new Intl.NumberFormat('en', {
      notation: 'compact'
      // style: 'unit', unit: 'frequency-hertz', unitDisplay: 'short' 
    }).format(value))
  }

  return (
    <div>
      {typeof param === 'string' && (
        <div className="param-controls">
          <select 
            className="param-select"
            onChange={handleTypeChange}
            value={type}
          >
            {types?.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}
      {typeof param !== 'string' && (
        <div className="param-controls">
          <div className="param-knob">
            <Knob
              max={max === Constants.NODE_MAX_VALUE ? Constants.MAX_VALUE : max}
              min={min === Constants.NODE_MIN_VALUE ? Constants.MIN_VALUE : min}
              value={value ?? 0}
              step={step2}
              skin={skin}
              onChange={handleKnobChange}
            />
          </div>
          <div className="param-connection">
            {name.substring(0, 4)}
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className={`connection ${(input?.length ?? 0) > 0 ? 'connected' : ''}`} 
            />
            <InputValue
              step={step ?? 0.01}
              min={min ?? 0}
              max={max ?? 1}
              value={value?.toString() ?? ''}
              onChange={(val: number) => onChange?.(name, val)}
            />
          </div>
          <div className="param-io">
            {typeof param !== 'string' && (
              <ModuleIO
                count={2}
                name={name}
                outputs={input}
                onClick={onClick}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
