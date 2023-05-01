import { useMemo } from "react";
import { useMinMax, useStep } from "../../hooks/ModuleHooks";
import { IONode, ParamOptions, RackAudioNode } from "../../types/RackTypes";
import InputValue from "../InputValue/InputValue";

import Constants from '../../constants';
import { ModuleIO } from "../ModuleIO";

interface ModuleParamProps<T extends RackAudioNode> {
  name: string; 
  param: AudioParam | string;
  onChange?: (name: string, val: number | string) => void;
  types?: string[];
  input?: IONode<T>
  value?: number;
  onClick: (name: string) => void;
  options?: ParamOptions,
  nodeId: string,
}

export default function ModuleParam<T extends RackAudioNode>({ 
  name, param, onChange, onClick, types, input, value, options, nodeId,
}: ModuleParamProps<T>) {
  const step = useStep(param);
  const { min, max } = useMinMax(name, param, options);
  
  const renderParam = useMemo(() => {
    if (typeof param === 'string') {
      return <p style={{ margin: "0 0 0 12px" }}>param</p>;
    } else {
      return (
        <InputValue
          step={step ?? 0.01}
          min={min ?? 0}
          max={max ?? 1}
          value={value?.toString() ?? ''}
          onChange={(val: number) => onChange?.(name, val)}
        />
      ); 
    }
  }, [param, min, max, value, step])

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(name, parseFloat(e.target.value));
  }

  return (
    <div style={{margin: "12px 0"}}>
      <div style={{ display: "flex", color: `#${input?.color}` }}>
        {name}:
        {renderParam} 
      </div>
      {/* TODO: might not be needed for dropdown params i.e. Oscillator type params */}
      <ModuleIO
        count={1}
        output={input}
        onClick={() => onClick(name)}
      />
      {typeof param === 'string' ? (
        <select 
          onChange={(e) => onChange?.(name, e.target.value)} 
        >
          {types?.map((type) => (
            <option key={type} value={type}>{type}</option>)
          )}
        </select>
       ) : (
        <input 
          type="range"
          min={(min === Constants.NODE_MIN_VALUE 
              ? Constants.MIN_VALUE 
              : min 
          )}
          max={(max === Constants.NODE_MAX_VALUE 
            ? Constants.MAX_VALUE 
            : max 
          )}
          value={value?.toFixed(3)}
          step={step}
          onChange={handleRangeChange}
        />
      )}
    </div>
  );
}
