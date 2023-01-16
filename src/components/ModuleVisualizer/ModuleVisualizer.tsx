import { Activity } from 'phosphor-react';
import { useState } from 'react'
import { AudioVisualizer } from '../AudioVisualizer';

import './ModuleVisualizer.css';

interface ModuleVisualizerProps {
  analyzer: AnalyserNode;
}

function ModuleVisualizer({ analyzer }: ModuleVisualizerProps) {
  const [visualizer, setVisualizer] = useState<boolean>(false);

  const handleToggleVisualizer = () => {
    setVisualizer((state: boolean) => !state);
  };

  return (
    <div className="module-visualizer">
      <button 
        className={`module-visualizer__button ${visualizer ? 'active' : ''}`}
        onClick={handleToggleVisualizer}
      >
        <Activity
          color={visualizer ? "#646cff" : "white"}
          size={20} 
        />
      </button>
      {visualizer && analyzer && (
        <AudioVisualizer node={analyzer} />
      )}
    </div>
  )
}

export default ModuleVisualizer
