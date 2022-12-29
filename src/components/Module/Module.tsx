import { Play, RadioButton } from 'phosphor-react';
import { useId, useMemo, useState } from 'react';
import { InputNode, OutputNode, RackNode } from '../../types/RackTypes';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import './Module.css';

interface RackNodeParamProps {
  name: string; 
  param: AudioParam | string;
  onChange?: (name: string, val: number | string) => void;
  types?: string[];
  input?: InputNode
  value?: number;
}
const useStep = (param: string | AudioParam) => {
  return useMemo(() => {
    if (typeof param === 'string') return;
    return param.maxValue - param.minValue <= 100 ? 0.001 : 0.01;    
  }, [param]);
}

function RackNodeParam({ name, param, onChange, types, input, value}: RackNodeParamProps) {
  const step = useStep(param);

  const renderParam = useMemo(() => {
    if (typeof param === 'string') {
      return param;
    } else {
      return value?.toFixed(2);
    }
  }, [param, value])

  return (
    <div>
      <div style={{ color: `#${input?.color}`}}>
        {name}:
        {' '}
        {renderParam} 
      </div>
      {typeof param === 'string' ? (
        <select onChange={(e) => onChange?.(name, e.target.value)} id="" name="">
          {types?.map((type) => (<option key={type} value={type}>{type}</option>))}
        </select>
       ) : (
        <input 
          type="range"
          min={param.minValue}
          max={param.maxValue}
          value={value?.toFixed(3)}
          step={step}
          onChange={(e) => onChange?.(name, parseFloat(e.target.value))}
        />
      )}
    </div>
  );
}

interface ModuleOutputsProps {
 count: number;
 output: OutputNode;
 onClick: () => void;
 name: string;
}

function ModuleIO({ count, output, onClick, name}: ModuleOutputsProps) {
  const id = useId();
  return (
    <div>
      <p className="module__io-name">{name}</p>
      {[...new Array(count)].map((_, i) => (
        <button 
          className="module__io-button"
          key={`${id}-${i}`}
          onClick={onClick}
        >
          <RadioButton size={20} color={output?.color} />
        </button>
      ))}
    </div>
  )
}

const useNodesMap = (nodes: (InputNode | OutputNode)[]) => {
  return useMemo(() => {
    if (!nodes) {
      return {}
    }
    const map: {[key: string]: InputNode} = {}
    for(let i = 0; i < nodes.length; i++) {
      let curr = nodes[i];
      map[!curr.paramName ? 'main' : curr.paramName] = curr;
    }
    return map;
  }, [nodes]);
}

const useParams = (paramMap?: Map<string, AudioParam>) => {
  const [paramValues, setParamValues] = useState(paramMap ? Object.fromEntries(paramMap) : null)

  const params = useMemo(() => {
    if (!paramValues) return [];
    return Object.entries(paramValues);
  }, [paramMap]);

  return { values: paramValues, setValues: setParamValues, params };
}

function Module({ node }: {node: RackNode}) {
  const { values, setValues, params } = useParams(node?.params);
  const { patches } = useRackState();

  const dispatch = useRackDispatch();
  const id = useId();

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

  const handleAddMainInput = () => { 
    dispatch({ actionType: Actions.AddInput , message: { inputId: node.id }});
  }

  const handleAddMainOutput = () => {
    dispatch({ actionType: Actions.AddOutput, message: { outputId: node.id }});
  }

  return (
    <div className="module">
      <h3>{node.name}</h3>
      {typeof node?.node?.start === 'function' && (
        <button className="module__io-button" onClick={() => node.node.start?.()}>
          <Play size={20} />  
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
            types={name === "type" && node?.types ? node.types : null}
            input={patches[node?.id]?.inputs ? patches[node?.id]?.inputs[name] : undefined}
          />
        ))}
      </div>
      <div className="module__io">
        {/* Main in */}
        <ModuleIO count={1} name="in" onClick={handleAddMainInput} output={patches[node.id]?.inputs?.main}/> 
        {/* Main out */}
        <ModuleIO count={1} name="out" onClick={handleAddMainOutput} output={patches[node.id]?.outputs?.main}/> 
      </div>
    </div>
  );
}

export default Module;
