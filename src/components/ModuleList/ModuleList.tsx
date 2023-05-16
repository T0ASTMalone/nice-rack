import { useMemo } from 'react'
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import * as JSONModules from '../../modules';
import mods from '../../assets/modules.json';

import './ModuleList.css';

function ModuleList() {
  const dispatch = useRackDispatch();
  const { context } = useRackState();

  const modNames = useMemo(() => mods.map((mod) => mod?.name), []);

  if (!context) {
    return null;
  }

  const handleAddNode = async (name: string) => {
    if (!modNames.includes(name)) {
      return;
    }

    const info = mods.find((mod) => mod.name === name);

    if (!info) { 
      return;
    }

    // TODO: use the location param to lazy load the module
    const newModule  = JSONModules[name as keyof typeof JSONModules];
    // TODO: show error 
    if (!newModule) { 
      return;
    }

    // TODO: show error 
    const NodeModule = newModule.Node;

    // const node = await new Modules[name as keyof typeof Modules](context).init()
    const node = await new NodeModule(context).init?.();

    dispatch({ actionType: Actions.AddModule, message: { module: node } });
  }
  
  return (
    <div className="module-list">
      <h3>MODULES</h3>
      {modNames.map((name) => (
        <button key={name} onClick={() => handleAddNode(name)}>{name}</button>)
      )}
    </div>
  )
}

export default ModuleList
