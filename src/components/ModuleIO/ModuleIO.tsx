import { useId } from "react";
import { RadioButton } from "phosphor-react";

import { IONode, RackAudioNode } from "../../types/RackTypes";

import './ModuleIO.css';

interface ModuleIOProps<T extends RackAudioNode> {
 count: number;
 output?: IONode<T>;
 onClick: (name: string) => void;
 name?: string;
}

export default function ModuleIO<T extends RackAudioNode>({
  count, output, onClick, name
}: ModuleIOProps<T>) {
  const id = useId();

  return (
    <div>
      {name && <p className="module-io__name">{name}</p>}
      {[...new Array(count)].map((_, i) => (
        <button 
          className="module-io__button"
          key={`${id}-${i}`}
          onClick={() => onClick(output?.paramName ?? '')}
        >
          <RadioButton size={20} color={output?.color} />
        </button>
      ))}
    </div>
  )
}
