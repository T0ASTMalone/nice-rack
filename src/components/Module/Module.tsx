import { Play, RadioButton, Stop } from 'phosphor-react';
import { useEffect, useId, useMemo, useState } from 'react';
import InputValue from '../InputValue/InputValue';

import Constants from '../../constants';
import { InputNode, OutputNode, ParamOptions, RackNode } from '../../types/RackTypes';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import './Module.css';
import { useMinMax, useParams, useStep } from '../../hooks/ModuleHooks';
import AudioVisualizer from '../Analyzer/Analyzer';

interface RackNodeParamProps {
  name: string; 
  param: AudioParam | string;
  onChange?: (name: string, val: number | string) => void;
  types?: string[];
  input?: InputNode
  value?: number;
  onClick: (name: string) => void;
  options?: ParamOptions, 
  nodeId: string,
}

interface ModuleIOProps {
 count: number;
 output?: OutputNode;
 onClick: (name: string) => void;
 name: string;
}

function ModuleIO({ count, output, onClick, name}: ModuleIOProps) {
  const id = useId();
  return (
    <div>
      <p className="module__io-name">{name}</p>
      {[...new Array(count)].map((_, i) => (
        <button 
          className="module__io-button"
          key={`${id}-${i}`}
          onClick={() => onClick(output?.paramName ?? '')}
        >
          <RadioButton size={20} color={output?.color} />
        </button>
      ))}
    </div>
  )
}

function RackNodeParam({ 
  name, param, onChange, onClick, types, input, value, options, nodeId,
}: RackNodeParamProps) {
  const step = useStep(param);
  const { min, max } = useMinMax(name, param, options);
  
  const renderParam = useMemo(() => {
    console.log('[RackNodeParam] updating value step or param');
    if (typeof param === 'string') {
      return param;
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
    <div>
      <div style={{ color: `#${input?.color}`}}>
        {name}:
        {' '}
        {renderParam} 
      </div>
      <ModuleIO 
        name={name}
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

function Module({ node }: {node: RackNode}) {
  const { values, setValues, params } = useParams(node?.params);
  const { patches } = useRackState();
  const dispatch = useRackDispatch();
  const [inputs, outputs] = useMemo(() => {
    return [patches?.[node.id]?.inputs, patches?.[node.id]?.outputs]
  }, [patches?.[node.id]?.inputs, patches?.[node.id]?.outputs]);
  const id = useId();

  const [started, setStarted] = useState(node?.started);

  const handleUpdateParam = (name: string , val: number | string) => {
    if (!values) return;

    const param = values[name];

    if (name === "type") {
      node.type = val;
    } else if (param && typeof val === 'number'){
      param.value = val;
    }

    setValues((state) => ({...state, [name]: param}));
  }

  const handleAddMainInput = (name: string) => { 
    dispatch({ 
      actionType: (!patches[node?.id]?.inputs?.main 
        ? Actions.AddInput 
        : Actions.RemoveInput),
      message: { inputId: node.id, param: name},
    });
  }

  const handleAddMainOutput = (name: string) => {
    dispatch({ 
      actionType: ((Object.keys(patches[node?.id]?.outputs ?? {}).length === 0)
      ? Actions.AddOutput 
      : Actions.RemoveOutput),
      message: { outputId: node.id, param: name }
    });
  }

  const handleParamClick = (name: string) => {
    dispatch({ 
      actionType: (!patches[node?.id]?.inputs?.[name] 
        ? Actions.AddInput 
        : Actions.RemoveInput),
      message: { inputId: node.id, param: name }
    });
  }

  const handleStartNode = () => {
    const nodeStarted = node.toggleStarted();
    setStarted(nodeStarted);
  }

  return (
    <div className="module">
      {/* add option to hide this */}
      <div style={{ backgroundColor: 'white' }} >
        {node.analyzer && <AudioVisualizer node={node.analyzer} />}
      </div>
      <h3>{node.name}</h3>
      {typeof node?.node?.start === 'function' && (
        <button 
          className="module__io-button"
          onClick={handleStartNode}
        >
          {started ? ( 
            <Stop size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>
      )}
      <div className="module__params">
        {params.map(([name, param], i) => (
          <RackNodeParam 
            key={`${id}-${param}-${i}`}
            onChange={handleUpdateParam}
            name={name}
            param={param}
            value={param?.value}
            types={node?.paramOptions?.type?.values}
            nodeId={node.id}
            input={inputs
              ? inputs[name] 
              : undefined
            }
            onClick={handleParamClick}
            options={node?.paramOptions?.[name]}
          />
        ))}
      </div>
      <div className="module__io">
        {/* Main in */}
        <ModuleIO
          count={1}
          name="in"
          onClick={handleAddMainInput}
          output={inputs?.main}
        /> 
        {/* Main out */}
        <ModuleIO
          count={1}
          name="out"
          onClick={handleAddMainOutput}
          output={Object.values(outputs ?? {})?.[0]}
        /> 
      </div>
    </div>
  );
}

export default Module;
