import { useEffect, useId } from 'react';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import { Module } from '../Module';

import './Rack.css';


export default function Rack() {
  const id = useId()
  const { context, modules, destination } = useRackState();
  const dispatch = useRackDispatch();

  useEffect(() => {
    if (context) {
      context.audioWorklet.addModule("PitchProcessor.js");
    }
  }, [context]);

  return (
    <div className="rack">
      {!context && <button onClick={() => dispatch({actionType: Actions.Init})}>Start</button>}
      {context && modules.map((m, i) => {
        return <Module key={`${id}-${i}`}  node={m} />
      })}
      {destination && <Module node={destination} />}
    </div>
  )
}
