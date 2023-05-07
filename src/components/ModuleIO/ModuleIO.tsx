import { RadioButton } from "phosphor-react";

import { IONode, RackAudioNode } from "../../types/RackTypes";

import './ModuleIO.css';

interface ModuleIOProps<T extends RackAudioNode> {
 count: number;
 output?: IONode<T>;
 outputs?: IONode<T>[];
 onClick: (connectionId: string, param?: string) => void;
 label?: string;
 name?: string;
}
// TODO: make count a max number of io rather than the number of io  
export default function ModuleIO<T extends RackAudioNode>({
  count, output, outputs, onClick, name, label
}: ModuleIOProps<T>) {

  if (count < 1) {
    return null;
  }

  return (
    <div>
      {name && <p className="module-io__name">{label}</p>}
      {outputs?.map((o) => (
        <button
          className="module-io__button"
          key={o.connectionId}
          onClick={() => onClick(o.connectionId, o?.paramName)}
        >
          <RadioButton size={20} color={o.color} />
        </button>
      ))}
      {count > (outputs?.length ?? 0) && (
        <button
          className="module-io__button"
          onClick={() => onClick('', name ?? '')}
        >
          <RadioButton size={20} color={output?.color} />
        </button>
      )}
    </div>
  )
}
