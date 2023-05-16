import { useMemo, useState } from "react";
import { useRackDispatch, useRackState } from "../contexts/RackContext";
import { Actions } from "../types/RackContextTypes";
import type { RackAudioNode, RackNode } from "../types/RackTypes";
import { useParams } from './ModuleHooks';

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
