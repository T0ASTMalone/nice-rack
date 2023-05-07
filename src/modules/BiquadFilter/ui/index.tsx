import { Canvas } from '../../../components/Canvas';
import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';
import { drawFilter } from './helpers/canvas-helpers';

import './index.css';

export default function BiquadFilter({ 
  node, context,
}:  RackModuleUIProps<BiquadFilterNode>): RackModuleUI<BiquadFilterNode> {
  return (
    <Module context={context} node={node}>
      <div className="audio-visualizer">
        <Canvas 
          className="audio-visualizer__canvas" 
          draw={(ctx: CanvasRenderingContext2D | null) => drawFilter(ctx, node)} 
        />
      </div>
    </Module>
  );
}
