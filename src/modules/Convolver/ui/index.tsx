import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';

// modules.json ui name
export default function Convolver({ 
  node, context,
}:  RackModuleUIProps<ConvolverNode>): RackModuleUI<ConvolverNode> {
  return <Module context={context} node={node} /> 
}
