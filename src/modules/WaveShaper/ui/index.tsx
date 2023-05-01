import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI } from '../../../types/RackTypes';

export default function WaveShaper({ 
  node, context,
}:  RackModuleUIProps<WaveShaperNode>): RackModuleUI<WaveShaperNode> {
  return <Module context={context} node={node} /> 
}
    
