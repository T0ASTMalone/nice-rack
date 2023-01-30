import { useMemo } from 'react'
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import * as Modules from '../../types/RackModules';

import './ModuleList.css';

function ModuleList() {
  const dispatch = useRackDispatch();
  const { context } = useRackState();

  const names = useMemo(() => {
    return Object.keys(Modules);
  }, [])

  if (!context) return null;

  const handleAddNode = (name: string) => {
    if (!names.includes(name)) return;
    const node = new Modules[name as keyof typeof Modules](context);
    dispatch({ actionType: Actions.AddModule, message: { module: node } });
  }
  
  return (
    <div className="module-list">
      {names.map((name) => (
        <button key={name} onClick={() => handleAddNode(name)}>{name}</button>)
      )}
    </div>
  )
}

export default ModuleList
