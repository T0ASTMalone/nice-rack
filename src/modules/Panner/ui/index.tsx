import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';

export default function Panner({ 
  node, context,
}:  RackModuleUIProps<PannerNode>): RackModuleUI<PannerNode> {
  return <Module context={context} node={node} /> 
}
