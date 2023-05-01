import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI } from '../../../types/RackTypes';

export default function Delay({ 
  node, context,
}:  RackModuleUIProps<DelayNode>): RackModuleUI<DelayNode> {
  return <Module context={context} node={node} /> 
}
    