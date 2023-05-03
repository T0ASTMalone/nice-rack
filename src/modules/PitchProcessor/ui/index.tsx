import { useEffect, useState } from "react";
import { Play, Stop } from 'phosphor-react';
import type { RackModuleUI, RackModuleUIProps } from "../../../types/RackTypes";
import { PitchReadout } from './components/PitchReadout';
import PitchNode from "../node/PitchNode";
import { throttle } from '../lib/utils';
import useRackApi from "../../../hooks/useRackApi";
import { ModuleIO } from "../../../components/ModuleIO";
import { ModuleVisualizer } from "../../../components/ModuleVisualizer";
import { Value } from "../../../components/Module/Module";

export default function PitchProcessor({ 
  context, node 
}: RackModuleUIProps<PitchNode>): RackModuleUI<PitchNode> {
  const [latestPitch, setLatestPitch] = useState(0);

  const { 
    inputs,
    outputs, 
    started,
    handleStartNode,
    handleAddMainOutput,
    handleAddMainInput 
  } = useRackApi(node);

  useEffect(() => {
    if (!node) {
      return;
    }

    node.node?.onValueChange?.(throttle(setLatestPitch, 300));
  }, [node]);

  return (
    <div className="module">
      {node.analyzer && <ModuleVisualizer analyzer={node.analyzer} />}
      <Value node={node} />
      <h3 className="module__io-name">{node.name}</h3>
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

      <div className="module__io">
        {/* Main in */}
        <ModuleIO
          count={2}
          name="main"
          label="in"
          onClick={handleAddMainInput}
          outputs={inputs?.main}
        />
        {/* Main out */}
        <ModuleIO
          count={1}
          label="out"
          name="main"
          onClick={handleAddMainOutput}
          outputs={outputs?.main}
        />
      </div>
      {node && <PitchReadout running={context.state === "running"} latestPitch={latestPitch} />}
    </div>
  );
}
