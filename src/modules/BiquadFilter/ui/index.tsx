import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';

export default function BiquadFilter({ 
  node, context,
}:  RackModuleUIProps<BiquadFilterNode>): RackModuleUI<BiquadFilterNode> {
  return <Module context={context} node={node} /> 
}
