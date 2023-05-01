import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';

export default function Oscillator({ 
  node, context,
}:  RackModuleUIProps<OscillatorNode>): RackModuleUI<OscillatorNode> {
  return <Module context={context} node={node} /> 
}

