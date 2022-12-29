import randomColor from "randomcolor";
import { v4 as uuid } from 'uuid';
import { RackState, IO } from "../types/RackContextTypes";
import { InputNode, OutputNode, RackNode } from "../types/RackTypes";

type CreateIOArgs = [string, string, RackNode | undefined, string | undefined ] 

export const createPatch = (id: string, type: IO, state: RackState, param?: string): RackState => {
  // find node
  const node = state.destination.id === id 
    ? state.destination 
    : state.modules.find((n) => n.id === id);
  
  // if !node return
  if (!node) return state;

  const list = type === IO.Input ? 'outPutNodes' : 'inputNodes';
  const stateIo = type === IO.Input ? 'output' : 'input';
  const newStateIo = type === IO.Input ? 'input' : 'output';
  const targetKey = type === IO.Input ? 'outputs' : 'inputs';
  const nodeKey = type === IO.Input ? 'inputs' : 'outputs';

  const target = state[stateIo]
    ? state.modules.find((n) => n[list].some((i) => i.connectionId === state[stateIo]))
      ?? (state.destination[list].some((n) => n.connectionId === state[stateIo]) 
        ? state.destination 
        : undefined)
    : undefined;
  if (target && target.id === node.id) {
    return state;
  }

  const targetNode = target?.[list]?.find((i) => i.connectionId === state[stateIo]);
  const connectionId = targetNode ? targetNode.connectionId : uuid();
  const color = targetNode? targetNode.color : randomColor();
  const args: CreateIOArgs = [connectionId, color, target, param]
  // create output for node
  const ioNode = type === IO.Input ? node.createInput(...args) : node.createOutput(...args);

  if (!targetNode || !target) {
    return { ...state, [newStateIo]: ioNode.connectionId };
  }

  targetNode.node = node;
  targetNode.param = ioNode.param;
  targetNode.paramName = ioNode.paramName;


  if (IO.Input === type)  {
    target.node.connect(node.node);
  } 

  return { 
    ...state,
    input: '',
    output: '',
    patches : {
      ...state.patches,
      [target.id]: {
        ...state.patches[target.id], 
        [targetKey]: {
          ...state.patches[target.id]?.[targetKey],
          [targetNode.paramName ?? 'main']: targetNode
        }
      },
      [node.id]: {
        ...state.patches[node.id],
        [nodeKey]: {
          ...state.patches[node.id]?.[nodeKey],
          [ioNode.paramName ?? 'main']: ioNode,
        }
      }
    }
  };
};

export const removePatch = (targetNode: InputNode | OutputNode) => {
  console.log(`reomving patch: ${targetNode}`);
}


