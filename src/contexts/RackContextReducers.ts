import randomColor from "randomcolor";
import { v4 as uuid } from 'uuid';
import { RackState } from "../types/RackContextTypes";

export const createOutput = (
  id: string,
  state: RackState,
  param?: string,
): RackState => {
  // find node
  const node = state.destination.id === id 
    ? state.destination 
    : state.modules.find((n) => n.id === id);
  
  // if !node return
  if (!node) return state;

  const input = state.input
    ? state.modules.find((n) => n.inputNodes.some((i) => i.connectionId === state.input))
      ?? (state.destination.inputNodes
          .some((n) => n.connectionId === state.input) 
        ? state.destination 
        : undefined)
    : undefined;

  if (input && input.id === node.id) {
    return state;
  }

  const inputNode = input?.inputNodes
    ?.find((i) => i.connectionId === state.input);

  const connectionId = inputNode ? inputNode.connectionId : uuid();
  const color = inputNode ? inputNode.color : randomColor();

  // create output for node
  const ioNode = node.createOutput(connectionId, color, input, inputNode?.paramName || param) 

  if (!inputNode || !input) {
    return { ...state, output: ioNode.connectionId };
  }

  inputNode.node = node;
  inputNode.param = ioNode.param;
  inputNode.paramName = ioNode.paramName;

  node?.init?.(node?.invokeOnValueUpdateCallbacks);

  return { 
    ...state,
    input: '',
    output: '',
    patches : {
      ...state.patches,
      [input.id]: {
        ...state.patches[input.id], 
        inputs: {
          ...state.patches[input.id]?.inputs,
          [ioNode.paramName || 'main']: inputNode,
        }
      },
      [node.id]: {
        ...state.patches[node.id],
        outputs: {
          ...state.patches[node.id]?.outputs,
          main: ioNode,
        }
      }
    }
  };
};

export const createInput = (
  id: string,
  state: RackState,
  param?: string,
): RackState => {
  // find node
  const node = state.destination.id === id 
    ? state.destination 
    : state.modules.find((n) => n.id === id);
  
  // if !node return
  if (!node) return state;

  // FIXME: gross   
  const output = state.output
    ? state.modules.find((n) => n.outPutNodes.some((i) => i.connectionId === state.output))
      ?? (state.destination.outPutNodes
          .some((n) => n.connectionId === state.output) 
        ? state.destination 
        : undefined)
    : undefined;

  if (output && output.id === node.id) {
    return state;
  }

  const outputNode = output?.outPutNodes
    ?.find((i) => i.connectionId === state.output);

  const connectionId = outputNode ? outputNode.connectionId : uuid();
  // TODO: make sure color does not already exist or is not close to another color
  const color = outputNode? outputNode.color : randomColor();


  // create output for node
  const ioNode = node.createInput(connectionId, color, output, param) 


  if (!outputNode || !output) {
    return { ...state, input: ioNode.connectionId };
  }

  outputNode.node = node;
  outputNode.param = node?.params?.get(param ?? '');
  outputNode.paramName = param;

  if (outputNode.param) {
    output.outputNode.connect(outputNode.param);
  }else{
    output.outputNode.connect(node.node);
  }

  node?.init?.(node?.invokeOnValueUpdateCallbacks);

  return { 
    ...state,
    input: '',
    output: '',
    patches : {
      ...state.patches,
      [output.id]: {
        ...state.patches[output.id], 
        outputs: {
          ...state.patches[output.id]?.outputs,
          main: outputNode
        }
      },
      [node.id]: {
        ...state.patches[node.id],
        inputs: {
          ...state.patches[node.id]?.inputs,
          [ioNode.paramName || 'main']: ioNode,
        }
      }
    }
  };
};
export const removeOutput = (
  id: string, state: RackState, param?: string
) => {                    
  let node = state.destination.id === id 
    ? state.destination 
    : state.modules.find((node) => node.id === id);

  if (!node) return state;
  
  let output = state.patches?.[id]?.outputs?.main;

  if (!output?.node) return state;

  const outputInputs = state.patches?.[output.node.id].inputs;
  const inputOutputs = state?.patches?.[node.id]?.outputs;

  delete inputOutputs['main'];
  delete outputInputs[param || 'main'];



  node.outputNode.disconnect();

  return {
    ...state,
    patches: {
      ...state.patches,
      [node.id]: {
        ...state.patches[node.id],
        ...{ outputs: {...inputOutputs}}
      },
      [output.node.id] : {
        ...state.patches[output.node.id],
        ...{ inputs: {...outputInputs} }
      }
    }
  };
}

export const removeInput = (
  id: string, state: RackState, param?: string
) => {                    
  let node = state.destination.id === id 
    ? state.destination 
    : state.modules.find((node) => node.id === id);

  if (!node) {
    console.log('[RackReducers] removeInput node not found')
    return state;
  }

  let input = state.patches?.[id]?.inputs?.[param || 'main'];

  if (!input?.node) {
    console.log('[RackReducers] removeInput input.node not found')
    return state;
  }

  const inputOutputs = state.patches?.[input.node.id].outputs;

  const nodeInputs = state.patches?.[node.id].inputs;

  delete inputOutputs?.main;

  delete nodeInputs?.[param || 'main'];

  console.log('[RackReducers] disconnecting')
  input.node.outputNode.disconnect();

  return {
    ...state,
    patches: {
      ...state.patches,
      [node.id]: {
        ...state.patches[node.id],
        ...{ inputs: {...nodeInputs} },
      },
      [input.node.id] : {
        ...state.patches[input.node.id],
        ...{ outputs: {...inputOutputs} }
      }
    }
  };
}
