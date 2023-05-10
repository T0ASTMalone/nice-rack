import { useMemo } from 'react';

import { RackModuleUIProps, RackAudioNode } from '../../types/RackTypes';
import Module from './Module';

import * as Modules from '../../modules';
import mods from '../../assets/modules.json';

import './Module.css';

export default function RackModule<T extends RackAudioNode>({ node, context }: RackModuleUIProps<T>) {
  const modNames = useMemo(() => mods.map((mod) => mod?.name), []);

  const Comp = useMemo(() => {
    if (!modNames.includes(node.name)) {
      return;
    }

    const info = mods.find((mod) => mod.name === node.name);

    if (!info) {
      return;
    }

    const newModule = Modules[node.name as keyof typeof Modules];

    if (!newModule) {
      return;
    }

    return newModule.Module;
  }, [node, modNames]);

  if (Comp) {
    // @ts-ignore
    return <Comp node={node} context={context} />
  }

  return <Module node={node} context={context} />
}
