import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';

export default function Gain({ 
  node, context,
}:  RackModuleUIProps<GainNode>): RackModuleUI<GainNode> {
  return <Module context={context} node={node} /> 
}
