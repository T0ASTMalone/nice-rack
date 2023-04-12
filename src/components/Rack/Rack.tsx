import { useId } from 'react';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import { Module } from '../Module';

import './Rack.css';


export default function Rack() {
  const id = useId()
  const { context, modules, destination } = useRackState();
  const dispatch = useRackDispatch();

  return (
    <div className="rack">
      {!context && <button onClick={() => dispatch({actionType: Actions.Init})}>Start</button>}
      {context && modules.map((m, i) => {
        return <Module context={context} key={`${id}-${i}`}  node={m} />
      })}
      {destination && context && <Module context={context} node={destination} />}
    </div>
  )
}
