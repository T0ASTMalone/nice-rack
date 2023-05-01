import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI } from '../../../types/RackTypes';

export default function ConstantSource({ 
  node, context,
}:  RackModuleUIProps<ConstantSourceNode>): RackModuleUI<ConstantSourceNode> {
  return <Module context={context} node={node} /> 
}
    