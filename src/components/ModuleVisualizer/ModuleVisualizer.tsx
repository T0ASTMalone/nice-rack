import { AudioVisualizer } from '../AudioVisualizer';

import './ModuleVisualizer.css';

interface ModuleVisualizerProps {
  visible?: boolean;
  analyzer: AnalyserNode;
}

function ModuleVisualizer({ visible, analyzer }: ModuleVisualizerProps) {
  return (
    <div className="module-visualizer">
      {visible && analyzer && (
        <AudioVisualizer node={analyzer} />
      )}
    </div>
  )
}

ModuleVisualizer.defaultProsp = {
  visible: false,
}

export default ModuleVisualizer
