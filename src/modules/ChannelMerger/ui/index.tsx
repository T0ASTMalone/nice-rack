import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI } from '../../../types/RackTypes';

export default function ChannelMerger({ 
  node, context,
}:  RackModuleUIProps<ChannelMergerNode>): RackModuleUI<ChannelMergerNode> {
  return <Module context={context} node={node} /> 
}
    