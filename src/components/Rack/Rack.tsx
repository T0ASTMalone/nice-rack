import { useId } from 'react';
import { useRackState } from '../../contexts/RackContext';
import { Module } from '../Module';

import './Rack.css';

export default function Rack() {
  const id = useId()
  const { modules, destination } = useRackState();
  return (
    <div className="rack">
      {modules.map((m, i) => <Module key={`${id}-${i}`}  node={m} />)}
      <Module node={destination} />
    </div>
  )
}
