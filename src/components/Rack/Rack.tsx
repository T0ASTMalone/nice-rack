import { useId } from 'react';
import { motion } from 'framer-motion';
import { useRackDispatch, useRackState } from '../../contexts/RackContext';
import { Actions } from '../../types/RackContextTypes';
import { Module, RackModule } from '../Module';
import { Logo } from '../Logo';
import './Rack.css';
import { useAnalyticsEventTracker } from '../../hooks/useAnalyticsEventTracker';


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
  const gaEventTracker = useAnalyticsEventTracker('User');
  return (
    <div className="rack">
      {!context && (
        <motion.div 
          className="rack__before-init"
          key="init-btn-container"
        >
          <Logo />
          <motion.button 
            key="init-btn"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={itemMain}
            layoutId="rack"  
            onClick={() => {
              gaEventTracker('Started App', 'Rack');
              dispatch({actionType: Actions.Init});
            }}
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
