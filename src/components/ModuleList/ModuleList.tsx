import { useMemo } from 'react'
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import * as Modules from '../../types/RackModules';
import * as JSONModules from '../../modules';
import mods from '../../assets/modules.json';
import './ModuleList.css';
import { RackAudioNode, RackModule, RackNode } from '../../types/RackTypes';

function ModuleList() {
  const dispatch = useRackDispatch();
  const { context } = useRackState();

  const names = useMemo(() => Object.keys(Modules), [])
  const modNames = useMemo(() => mods.map((mod) => mod?.name), []);

  if (!context) {
    return null;
  }
  const handleAddNode = async (name: string) => {
    if (!modNames.includes(name)) {
      return;
    }
    const info = mods.find((mod) => mod.name === name);

    if (!info) return;
    // TODO: use the location param to lazy load the module
    const newModule  = JSONModules[name as keyof typeof JSONModules];
    // const newModule = await import(info.location) as RackModule<any>;

    // TODO: show error 
    if (!newModule) return;

    // TODO: show error 
    const NodeModule = newModule['Node' as keyof RackModule<any>] as RackNode<any>

    // const node = await new Modules[name as keyof typeof Modules](context).init()
    const node = await new NodeModule(context).init?.();

    dispatch({ actionType: Actions.AddModule, message: { module: node } });
  }

  const handleImportedNode = (name: string) => {
    if (!names.includes(name)) {
      return;
    }
    const node = new Modules[name as keyof typeof Modules](context);
    dispatch({ actionType: Actions.AddModule, message: { module: node } });
  }
  
  return (
    <div className="module-list">
      <h3>JSON MODS</h3>
      {modNames.map((name) => (
        <button key={name} onClick={() => handleAddNode(name)}>{name}</button>)
      )}
      <h3>IMPORTED MODS</h3>
      {names.map((name) => (
        <button key={name} onClick={() => handleImportedNode(name)}>{name}</button>)
      )}
    </div>
  )
}

export default ModuleList
