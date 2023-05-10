import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Activity, Play, Stop, X } from 'phosphor-react';
import type { RackModuleUI, RackModuleUIProps } from "../../../types/RackTypes";
import { PitchReadout } from './components/PitchReadout';
import PitchNode from "../node/PitchNode";
import { throttle } from '../lib/utils';
import useRackApi, { useRemoveModule } from "../../../hooks/useRackApi";
import { ModuleIO } from "../../../components/ModuleIO";
import { ModuleVisualizer } from "../../../components/ModuleVisualizer";
import { Value } from "../../../components/Module/Module";

const fadeIn = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
};

const fadeOut = {
  rest: { opacity: 1 },
  hover: { opacity: 0 },
}

export default function PitchProcessor({ 
  context, node 
}: RackModuleUIProps<PitchNode>): RackModuleUI<PitchNode> {
  const [visualizer, setVisualizer] = useState<boolean>(false);
  const [latestPitch, setLatestPitch] = useState(0);

  const { 
    inputs,
    outputs, 
    started,
    handleStartNode,
    handleAddMainOutput,
    handleAddMainInput 
  } = useRackApi(node);
  
  const removeModule = useRemoveModule();

  useEffect(() => {
    if (!node) {
      return;
    }

    node.node?.onValueChange?.(throttle(setLatestPitch, 300));
  }, [node]);

  const handleToggleVisualizer = () => {
    setVisualizer((state: boolean) => !state);
  };

  return (
    <motion.div initial="rest" whileHover="hover" className="module">
      <div className="module__header">
        <motion.div variants={fadeIn} className="module__controls">
          {node.name !== 'Destination' && (
            <button
              onClick={() => removeModule(node.id)}
              className="module__io-button"
            >
              <X width={20} height={20}/>
            </button>
          )}
          {node.analyzer && (
            <button 
              className={`module__io-button ${visualizer ? 'active' : ''}`}
              onClick={handleToggleVisualizer}
            >
              <Activity
                color={visualizer ? "#646cff" : "white"}
                size={20} 
              />
            </button>
          )}
          {node.name !== 'Destination' && (
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
        </motion.div>
        <motion.h3 
          variants={node.name !== 'Destination' ? fadeOut : {}}
          className="module__io-name"
        >
          {node.name}
        </motion.h3>
      </div>
      <div style={{ marginTop: '44px' }}>
        {node.analyzer && <ModuleVisualizer analyzer={node.analyzer} visible={visualizer} />}
        <Value node={node} />
        {node && <PitchReadout running={context.state === "running"} latestPitch={latestPitch} />}
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
      </div>
    </motion.div>
  );
}
