import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI } from '../../../types/RackTypes';

export default function StereoPanner({ 
  node, context,
}:  RackModuleUIProps<StereoPannerNode>): RackModuleUI<StereoPannerNode> {
  return <Module context={context} node={node} /> 
}
    
