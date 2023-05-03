import randomColor from "randomcolor";
import { v4 as uuid } from 'uuid';
import { RackState } from "../types/RackContextTypes";
import { IONode } from "../types/RackTypes";

export const removeModule = (state: RackState, moduleId: string): RackState => {
  // remove all patches 
  const inputs = Object.entries(state.patches[moduleId]?.inputs ?? {});
  const outputs = Object.entries(state.patches[moduleId]?.outputs ?? {});

  let newState = state;

  console.log('[removeModule] removing module inputs')
  for (let i = 0; i < inputs.length; i++) {
    let [key, value] = inputs[i];
    for (let j = 0; j < value.length; j++) {
      console.log('[removeModule] removing module input', value[j].node.id, value[j].connectionId, value[j].paramName)
      newState = { ...removeInput(moduleId, newState, value[j].connectionId, value[j].paramName) };
    }
  }

  console.log('[removeModule] removing module outputs')
  for (let i = 0; i < outputs.length; i++) {
    let [key, value] = outputs[i];
    for (let j = 0; j < value.length; j++) {
      console.log('[removeModule] removing module outputs', moduleId, value[j].connectionId, 'main')
      newState = { ...removeOutput(moduleId, newState, value[j].connectionId) };
    }
  }

  // TO Test removing connections 
  // return { ...newState };
  return {...newState, modules: [...newState.modules.filter((m) => m.id !== moduleId)] };
}

export const createOutput = (
  id: string,
  state: RackState,
  param?: string,
): RackState => {
  console.log('[createOutput] running');
  // find node
  const node = (state.destination && state.destination.id === id)
    ? state.destination 
    : state.modules.find((n) => n.id === id);
  
  // if !node return
  if (!node) { 
    console.log('[createOutput] no node');
    return state;
  }

  let input;

  if (state.input) {
    console.log('[createOutput] state has input');
    input = state.modules.find((n) => n.inputNodes.some((i) => i.connectionId === state.input)) 

    if (!input && state.destination && state.destination.inputNodes.some((n) => n.connectionId === state.input)) {
      console.log('[createOutput] input is destination');
      input = state.destination 
    }
  } 

  if (input && input.id === node.id) {
    console.log('[createOutput] is self');
    return state;
  }

  const inputNode = input?.inputNodes?.find((i) => i.connectionId === state.input);
  const connectionId = inputNode ? inputNode.connectionId : uuid();
  const color = inputNode ? inputNode.color : randomColor();

  // create output for node
  const ioNode = node.createOutput(
    connectionId,
    color,
    input,
    inputNode?.paramName || param
  );

  if (!inputNode || !input) {
    console.log('[createOutput] setting output. Not creating connection');
    return { ...state, output: ioNode.connectionId };
  }

  inputNode.node = node;
  inputNode.param = ioNode.param;
  inputNode.paramName = ioNode.paramName;

  console.log('[createOutput] updating state');
  return { 
    ...state,
    // clear inputs
    input: '',
    output: '',
    // update patches 
    patches : {
      ...state.patches,
      [input.id]: {
        ...state.patches[input.id], 
        inputs: {
          ...state.patches[input.id]?.inputs,
          [ioNode.paramName || 'main']: [ ...(state.patches[node.id]?.inputs?.[ioNode.paramName || 'main'] ?? []), inputNode],
        }
      },
      [node.id]: {
        ...state.patches[node.id],
        outputs: {
          ...state.patches[node.id]?.outputs,
          main: [...(state.patches[node.id]?.outputs?.main ?? []), ioNode],
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
  console.log('[createInput] running');
  // find node
  const node = (state.destination && state.destination.id === id)
    ? state.destination 
    : state.modules.find((n) => n.id === id);
  
  // if !node return
  if (!node) { 
    console.log('[createInput] no node');
    return state;
  }

  let output;

  if (state.output) {
    console.log('[createInput] state has input');
    output = state.modules.find((n) => n.outPutNodes.some((i) => i.connectionId === state.output));

    if (!output && state?.destination?.outPutNodes.some((n) => n.connectionId === state.output)) {
      console.log('[createInput] input is destination');
      output = state.destination
    }
  }

  if (output && output.id === node.id) {
    console.log('[createInput] is self');
    return state;
  }

  const outputNode = output?.outPutNodes?.find((i) => i.connectionId === state.output);

  const connectionId = outputNode ? outputNode.connectionId : uuid();
  // TODO: make sure color does not already exist or is not close to another color
  const color = outputNode? outputNode.color : randomColor();


  // create output for node
  const ioNode = node.createInput(connectionId, color, output, param) 
  

  if (!outputNode || !output) {
    console.log('[createInput] setting input. Not creating connection');
    return { ...state, input: ioNode.connectionId };
  }

  outputNode.node = node;
  outputNode.param = node?.params?.get(param ?? '');
  outputNode.paramName = param;

  if (outputNode.param) {
    output.outputNode.connect(outputNode.param);
  }else if (node.node){
    // ^ TODO: figure out if we should throw an error or something
    output.outputNode.connect(node.node);
  }

  console.log('[createInput] updating state');
  return { 
    ...state,
    // clear staged input outputs
    input: '',
    output: '',
    // update patches 
    patches : {
      ...state.patches,
      [output.id]: {
        ...state.patches[output.id], 
        outputs: {
          ...state.patches[output.id]?.outputs,
          main: [...(state.patches[output.id]?.outputs?.main ?? []), outputNode]
        }
      },
      [node.id]: {
        ...state.patches[node.id],
        inputs: {
          ...state.patches[node.id]?.inputs,
          [ioNode.paramName || 'main']: [ ...(state.patches[node.id]?.inputs?.[ioNode.paramName || 'main'] ?? []), ioNode],
        }
      }
    }
  };
};

export const removeOutput = (
  id: string, state: RackState, connectionId: string, param?: string,
) => {                    
  let node = (state?.destination && state.destination.id === id)
    ? state.destination 
    : state.modules.find((node) => node.id === id);
    // : state.modules.find((node) => (node.id === id && node.outPutNodes.some((n) => n.connectionId === connectionId)));

  if (!node) {
    console.log('[RackReducers] node not found');
    return state;
  }
  
  let output: IONode<any> = state.patches?.[id]?.outputs?.main
    ?.find((o) => o.connectionId === connectionId);
  
  if (!output?.node) {
    console.log('[RackReducers] output node not found');
    return state;
  }
  
  const outputInputs: IONode<any>[] = state.patches?.[output.node.id].inputs?.[param || 'main']
    ?.filter((p) => p.connectionId !== connectionId) ?? [];

  const inputOutputs: IONode<any>[] = state?.patches?.[node.id]?.outputs?.main
    ?.filter((p) => p.connectionId !== connectionId) ?? [];

  // TODO: remove node from list of ionodes (call remove output) in racknode class
  node.outputNode.disconnect();

  node.removeOutput(connectionId);
  output.node.removeInput(connectionId);

  return {
    ...state,
    // update patches 
    patches: {
      ...state.patches,
      [node.id]: {
        ...state.patches[node.id],
        ...{
          outputs: {
            // ...inputOutputs
            ...state.patches[node.id]?.outputs,
            main : [...inputOutputs]
          }
        }
      },
      [output.node.id] : {
        ...state.patches[output.node.id],
        ...{
          inputs: {
            ...state.patches[output.node.id]?.inputs,
            [output?.paramName || 'main'] : [...outputInputs]
          } 
        }
      }
    }
  };
}

export const removeInput = (
  id: string, state: RackState, connectionId: string, param?: string,
) => {                    
  let node = (state.destination && state.destination.id === id)
    ? state.destination 
    : state.modules.find((node) => node.id === id);

  if (!node) {
    console.log('[RackReducers] node not found')
    return state;
  }

  let input = state.patches?.[id]?.inputs?.[param || 'main']
    ?.find((o) => o.connectionId === connectionId);

  if (!input?.node) {
    console.log('[RackReducers] input node not found')
    return state;
  }

  const inputOutputs = state.patches?.[input.node.id].outputs?.main
    ?.filter((p) => p.connectionId !== connectionId) ?? [];

  const nodeInputs = state.patches?.[node.id].inputs?.[param || 'main']
    ?.filter((p) => p.connectionId !== connectionId) ?? [];

  console.log('[RackReducers] disconnecting')
  input.node.outputNode.disconnect();

  input.node.removeOutput(connectionId);
  node.removeInput(connectionId);

  return {
    ...state,
    patches: {
      ...state.patches,
      [node.id]: {
        ...state.patches[node.id],
        ...{
          inputs: {
            ...state.patches[node.id].inputs,
            [param || 'main']: [...nodeInputs]
          } 
        },
      },
      [input.node.id] : {
        ...state.patches[input.node.id],
        ...{
          outputs: {
            ...state.patches[input.node.id].outputs,
            main : [...inputOutputs]
          } 
        }
      }
    }
  };
}
