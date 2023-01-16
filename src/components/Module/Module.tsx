import { Play, Stop } from 'phosphor-react';
import { useId, useMemo, useState } from 'react';

import InputValue from '../InputValue/InputValue';

import { RackNode } from '../../types/RackTypes';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';

import { useMinMax, useParams, useStep } from '../../hooks/ModuleHooks';

import './Module.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { ModuleVisualizer } from '../ModuleVisualizer';
import { ModuleIO } from '../ModuleIO';
import { ModuleParam } from '../ModuleParam';


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
      <OverlayScrollbarsComponent 
        options={{ scrollbars: { autoHide: 'scroll' } }} 
        style={{ maxHeight: "100%" }}
        defer
      >
        <div className="module__scroll-container">
          {node.analyzer && <ModuleVisualizer analyzer={node.analyzer}/>}

          <h3 className="module__io-name">{node.name}</h3>

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

          <div className="module__params">
            {params && params.length > 0 && <h4>Parameters</h4>}
            {params.map(([name, param], i) => (
              <ModuleParam
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
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
}

export default Module;
