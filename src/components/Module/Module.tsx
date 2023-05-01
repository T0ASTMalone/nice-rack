import { useEffect, useState } from 'react';
import { Play, Stop } from 'phosphor-react';

import { RackNode, RackModuleUIProps, RackAudioNode } from '../../types/RackTypes';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { ModuleVisualizer } from '../ModuleVisualizer';
import { ModuleIO } from '../ModuleIO';
import { ModuleParam } from '../ModuleParam';

import useRackApi from '../../hooks/useRackApi';

import './Module.css';

export function Value({ node }: { node: RackNode<any> }) {
  const [val, setVal] = useState();

  useEffect(() => {
    if (node) {
      node.onValueUpdate((val: any) => setVal(val));
    }
  }, [node]);

  return <span>{val}</span>
}

function Module<T extends RackAudioNode>({ node }: RackModuleUIProps<T>) {
  const { 
    id, 
    started,
    inputs,
    outputs,
    params,
    handleUpdateParam,
    handleAddMainInput,
    handleStartNode, 
    handleParamClick, 
    handleAddMainOutput, 
  } = useRackApi(node);

  return (
    <div className="module">
      <OverlayScrollbarsComponent 
        options={{ scrollbars: { autoHide: 'scroll' } }} 
        style={{ maxHeight: "100%" }}
        defer
      >
        <div className="module__scroll-container">
          {node.analyzer && <ModuleVisualizer analyzer={node.analyzer}/>}
          <Value node={node} />
          <h3 className="module__io-name">{node.name}</h3>

          {/* typeof node?.node?.start === 'function' && ( */}
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
          {/* ) */}

          <div className="module__io">
            {/* Main in */}
            <ModuleIO
              count={node.node?.numberOfInputs ?? 0}
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

