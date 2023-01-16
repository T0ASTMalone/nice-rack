import { useId } from "react";
import { RadioButton } from "phosphor-react";

import { OutputNode } from "../../types/RackTypes";

import './ModuleIO.css';

interface ModuleIOProps {
 count: number;
 output?: OutputNode;
 onClick: (name: string) => void;
 name?: string;
}

export default function ModuleIO({
  count, output, onClick, name
}: ModuleIOProps) {
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
