import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';

export default function DynamicCompressor({ 
  node, context,
}:  RackModuleUIProps<DynamicsCompressorNode>): RackModuleUI<DynamicsCompressorNode> {
  return <Module context={context} node={node} /> 
}
