import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI} from '../../../types/RackTypes';
import { FilterVisualizer } from './partials';

export default function BiquadFilter({ 
  node, context,
}:  RackModuleUIProps<BiquadFilterNode>): RackModuleUI<BiquadFilterNode> {
  return (
    <Module context={context} node={node}>
      <FilterVisualizer node={node} />
    </Module>
  );
}
