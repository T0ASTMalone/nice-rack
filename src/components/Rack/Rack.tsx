import { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import { Module, RackModule } from '../Module';

import './Rack.css';

const itemMain = {
  hidden: { y: 200 },
  show: { 
    y: 0,
    transition: {
      duration: 0.6
    }
  }, 
  exit: {
    y: 200,
    transition: {
      duration: 0.6
    }
  }
}

export default function Rack() {
  const id = useId()
  const { context, modules, destination } = useRackState();
  const dispatch = useRackDispatch();

  return (
    <div className="rack">
      {!context && (
        <motion.div 
          className="rack__before-init"
          key="init-btn-container"
        >
          <motion.button 
            key="init-btn"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={itemMain}
            layoutId="rack"  
            onClick={() => dispatch({actionType: Actions.Init})}
          >
            Start
          </motion.button>
        </motion.div>
      )}
      {context && (
        <>
          <motion.h2 className="rack__header" layout transition={{ duration: .5 }}>Rack</motion.h2>
          <motion.div
            key="rack-key"
            layoutId="rack"
            className={`rack__modules ${context ? 'ready' : ''}`}
            transition={{
              duwation: 0.6
            }}
          >
            {/* modules */}
            {modules.map((m, i) => { 
              return <RackModule context={context} key={`${id}-${i}`}  node={m} />
            })}
            {/* destination node */}
            {destination && <Module context={context} node={destination} />}
          </motion.div>
        </>
      )}
    </div>
  )
}
