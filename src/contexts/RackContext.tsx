import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { init } from 'pitch-processor';
import { Actions, RackAction, RackState } from '../types/RackContextTypes';
import { RackDestinationNode } from '../types/RackTypes';
import { createInput, createOutput, removeInput, removeOutput } from './RackContextReducers';

const RackStateContext = createContext<RackState | undefined>(undefined);
const RackDispatchContext = createContext<React.Dispatch<RackAction> | undefined>(undefined);

const RackAudioContext = new AudioContext();
const defaultRackState: RackState = {
  context: RackAudioContext,
  destination: new RackDestinationNode(RackAudioContext),
  patches: {}, 
  modules: [],
  input: '',
  output: '',
};

const rackReducer = (state: RackState, action: RackAction): RackState => {
  if (!action) {
    return state;
  }

  switch (action.actionType) {
    case Actions.AddModule:
      return { ...state, modules: [...state.modules, action.message.module] };
    case Actions.RemoveModule:
      // TODO: remove any patches with this module
      // TODO: disconnect from AudioContext if connected
      // remove input / output if part of this module
      return {
        ...state,
        modules: [...state.modules.filter((mod) => mod.id !== action.message.moduleId)],
      };
    case Actions.AddOutput:
      return {...createOutput(action.message.outputId, state, action.message.param)}
    case Actions.AddInput:
      return {...createInput(action.message.inputId, state, action.message.param)}
    case Actions.RemoveOutput: 
      return {...removeOutput(action.message.outputId, state, action.message.param)}
    case Actions.RemoveInput: 
      return {...removeInput(action.message.inputId, state, action.message.param)}
    default:
      break;
  }
  return state;
};

function RackProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(rackReducer, defaultRackState);

  useEffect(() => {
    if (state.context) {
      // call init function for third party modules
      init(state.context);
    }
  }, [state.context]);

  return (
    <RackStateContext.Provider value={state}>
      <RackDispatchContext.Provider value={dispatch}>
        {children}
      </RackDispatchContext.Provider>
    </RackStateContext.Provider>
  );
}

const useRackState = () => {
  const context = useContext(RackStateContext);
  if (context === undefined) {
    throw new Error('[useRackState] context is undefined');
  }
  return context;
};

const useRackDispatch = () => {
  const context = useContext(RackDispatchContext);
  if (context === undefined) {
    throw new Error('[useRackState] context is undefined');
  }
  return context;
};

export { RackProvider, useRackState, useRackDispatch };
