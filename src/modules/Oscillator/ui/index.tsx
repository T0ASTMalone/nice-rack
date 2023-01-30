import { Module } from '../../../components/Module';
import { RackNode } from '../../../types/RackTypes';

export default function OscillatorModule({ node }: { node: RackNode }) {
  return <Module node={node} />
}

