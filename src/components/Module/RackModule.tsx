import { useMemo } from 'react';

import { RackModuleUIProps, RackAudioNode } from '../../types/RackTypes';
import Module from './Module';

import * as JSONModules from '../../modules';
import mods from '../../assets/modules.json';

import './Module.css';

export default function RackModule<T extends RackAudioNode>({ node, context }: RackModuleUIProps<T>) {
  const modNames = useMemo(() => mods.map((mod) => mod?.name), []);

  const Comp = useMemo<[boolean, React.ReactNode | undefined]>(() => {
    if (!modNames.includes(node.name)) {
      return;
    }

    const info = mods.find((mod) => mod.name === node.name);

    if (!info) {
      return;
    }

    const newModule: any = JSONModules[node.name as keyof typeof JSONModules];

    if (!newModule) {
      return;
    }

    return newModule.Module;
  }, [node, modNames]);

  if (Comp) {
    console.log('[RackModule] Comp: ', node.name);
    return <Comp node={node} context={context} />
  }

  console.log('[RackModule] Module: ', node.name);
  return <Module node={node} context={context} />
}
