import { useId, useMemo, useState } from "react";
import { useRackDispatch, useRackState } from "../contexts/RackContext";
import { Actions } from "../types/RackContextTypes";
import { RackAudioNode, RackNode } from "../types/RackTypes";
import { useParams } from './ModuleHooks';

export default function useRackApi<T extends RackAudioNode>(node: RackNode<T>) {
  const id = useId();
  const { values, setValues, params } = useParams(node.params);
  const { patches } = useRackState();
  const dispatch = useRackDispatch();
  const [started, setStarted] = useState(node?.started);

  const [inputs, outputs] = useMemo(() => {
    return [patches?.[node.id]?.inputs, patches?.[node.id]?.outputs]
  }, [patches?.[node?.id]?.inputs, patches?.[node.id]?.outputs]);

  /**
    * @param {string} name The name of the param that was clicked
    * @param {number | string} val The new value for the param
    *
    * The name can be:
    * 1. the name of one of the node's params
    * 2. "in" for the node's input
    * 3. "out" for the node's output
    */
  const handleUpdateParam = (name: string , val: number | string) => {
    if (!values) return;

    const param = values[name];

    if (name === "type") {
      node.type = val;
    } else if (param && typeof val === 'number'){
      param.value = val;
    }

    setValues((state) => ({...state, [name]: param}));
  }

  /**
    * @param {string} name The name of the param that was clicked
    *
    * The name can be:
    * 1. the name of one of the node's params
    * 2. "in" for the node's input
    * 3. "out" for the node's output
    */
  const handleAddMainInput = (connectionId: string, param?: string) => { 
    const p = patches[node?.id]?.inputs?.main;
    const existing = p?.find(c => c.connectionId === connectionId);

    dispatch({ 
      actionType: (!existing ? Actions.AddInput : Actions.RemoveInput),
      message: { inputId: node.id, connectionId, param },
    });
  }

  /**
    * @param {string} name The name of the param that was clicked
    *
    * The name can be:
    * 1. the name of one of the node's params
    * 2. "in" for the node's input
    * 3. "out" for the node's output
    */
  const handleAddMainOutput = (connectionId: string, param?: string) => {
    const p = patches[node?.id]?.outputs?.main;

    const existing = p?.find(c => c.connectionId === connectionId);

    dispatch({ 
      actionType: (!existing ? Actions.AddOutput : Actions.RemoveOutput),
      message: { outputId: node.id, param, connectionId }
    });
  }

  /**
    * 
    * Checks existing existing input patches for node with name.
    * If it does not exist it will dispatch an AddInput action 
    * If it does exist it will dispatch a RemoveInput action.
    *
    * @param {string} name The name of the param that was clicked
    *
    * The name can be:
    * 1. the name of one of the node's params
    * 2. "in" for the node's input
    * 3. "out" for the node's output
    */
  const handleParamClick = (connectionId: string, param?: string) => {
    const p = patches[node?.id]?.inputs?.[param || 'main'];
    const existing = p?.find(c => c.connectionId === connectionId);
    dispatch({ 
      actionType: (!existing ? Actions.AddInput : Actions.RemoveInput),
      message: { inputId: node.id, param, connectionId }
    });
  }
  
  /**
    * On/Off switch for the node 
    */
  const handleStartNode = () => {
    const nodeStarted = node.toggleStarted();
    setStarted(nodeStarted);
  }


  return {
    id, 
    params,
    started, 
    inputs, 
    outputs,
    handleUpdateParam,
    handleAddMainInput,
    handleAddMainOutput,
    handleParamClick,
    handleStartNode,
  }
}

export function useNodeIO<T extends RackAudioNode>(node: RackNode<T>) {
  const { patches } = useRackState();

  return useMemo(() => {
    return [patches?.[node.id]?.inputs, patches?.[node.id]?.outputs]
  }, [patches?.[node?.id]?.inputs, patches?.[node.id]?.outputs]);
}

export function useUpdateParams<T extends RackAudioNode>(
  node: RackNode<T>
): [[string, AudioParam][], (name: string, val: string | number) => void] {
  const { values, setValues, params } = useParams(node.params);

  const handleUpdate = (name: string , val: number | string) => {
    if (!values) return;

    const param = values[name];

    if (name === "type") {
      node.type = val;
    } else if (param && typeof val === 'number'){
      param.value = val;
    }

    setValues((state) => ({...state, [name]: param}));
  }

  return [params, handleUpdate];
}

export function useStartNode<T extends RackAudioNode>(node: RackNode<T>): [boolean, () => void] {
  const [started, setStarted] = useState(node?.started);

  const handleStartNode = () => {
    const nodeStarted = node.toggleStarted();
    setStarted(nodeStarted);
  }

  return [started, handleStartNode];
}

export function useParamClick<T extends RackAudioNode>(node: RackNode<T>) {
  const { patches } = useRackState();
  const dispatch = useRackDispatch();

  return (connectionId: string, param?: string) => {

    const p = patches[node?.id]?.inputs?.[param || 'main'];
    const existing = p?.find(c => c.connectionId === connectionId);

    dispatch({ 
      actionType: (!existing ? Actions.AddInput : Actions.RemoveInput),
      message: { inputId: node.id, param, connectionId }
    });
  }
}

export function useMainOutputClick<T extends RackAudioNode>(node: RackNode<T>) {
  const { patches } = useRackState();
  const dispatch = useRackDispatch();
  return (connectionId: string, param?: string) => {
    const p = patches[node?.id]?.outputs?.main;

    const existing = p?.find(c => c.connectionId === connectionId);

    dispatch({ 
      actionType: (!existing ? Actions.AddOutput : Actions.RemoveOutput),
      message: { outputId: node.id, param, connectionId }
    });
  }
}

export function useMainInputClick<T extends RackAudioNode>(node: RackNode<T>) {
  const { patches } = useRackState();
  const dispatch = useRackDispatch();

  return (connectionId: string, param?: string) => { 
    const p = patches[node?.id]?.inputs?.main;

    const existing = p?.find(c => c.connectionId === connectionId);

    dispatch({ 
      actionType: (!existing ? Actions.AddInput : Actions.RemoveInput),
      message: { inputId: node.id, connectionId, param },
    });
  }
}

export const useRemoveModule = () => {
  const dispatch = useRackDispatch();

  return (moduleId: string) => {
    dispatch({
      actionType: Actions.RemoveModule,
      message: { moduleId },
    });
  };
}
