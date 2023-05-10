import { Module } from '../../../components/Module';
import { RackModuleUIProps, RackModuleUI } from '../../../types/RackTypes';

export default function Analyzer({ 
  node, context,
}:  RackModuleUIProps<AnalyserNode>): RackModuleUI<AnalyserNode> {
  return <Module context={context} node={node} /> 
}
    
