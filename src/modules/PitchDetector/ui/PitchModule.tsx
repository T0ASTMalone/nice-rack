import { useEffect, useState } from "react";
import type { RackModuleUI, RackModuleUIProps } from "../../../types/RackTypes";
import { PitchReadout } from './components/PitchReadout';
import PitchNode from "../node/PitchNode";
import { throttle } from '../lib/utils';

export default function AudioRecorderControl({ 
  context, node 
}: RackModuleUIProps<PitchNode>): RackModuleUI<PitchNode> {

  const [latestPitch, setLatestPitch] = useState(0);

  useEffect(() => {
    if (!node) {
      return;
    }

    node.node?.onValueChange?.(throttle(setLatestPitch, 300));
  }, [node]);

  return (
    node && <PitchReadout running={context.state === "running"} latestPitch={latestPitch} />
  );
}
