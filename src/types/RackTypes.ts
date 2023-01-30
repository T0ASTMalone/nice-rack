import { v4 as uuid } from 'uuid';

class InputNode {
  node?: RackNode;

  paramName?: string;

  param?: AudioParam;

  connectionId: string;

  color: string;

  constructor(
    id: string,
    color: string,
    node?: RackNode,
    param?: AudioParam,
    paramName?: string,
  ) {
    this.node = node;
    this.param = param;
    this.connectionId = id;
    this.color = color;
    this.paramName = paramName;
  }
}

class OutputNode {
  node?: RackNode;

  paramName?: string;

  param?: AudioParam;

  connectionId: string;

  color: string;

  constructor(
    id: string,
    color: string,
    node?: RackNode,
    param?: AudioParam,
    paramName?: string,
  ) {
    this.node = node;
    this.param = param;
    this.connectionId = id;
    this.color = color;
    this.paramName = paramName;
  }
}

const classToObject = (theClass: any) => {
  const originalClass = theClass || {};
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));
  return keys.reduce((classAsObj: {[key: string]: any}, key: string) => {
    classAsObj[key] = originalClass[key];
    return classAsObj;
  }, {});
};

// idk why this works when using classToObject
interface AudioNodeObject {
}

interface RackAudioNode extends AudioNode {
  type?: string;
  start?: (when?: number) => void;
  stop?: (when?: number) => void;
  init?: () => void;
  gain?: AudioParam;
}

export type ParamOptions = {
  min?: number;
  max?: number;
  values?: string[];
  type?: string;
}

interface RackNodeOptions {
  name: string;
  paramOptions?: {[key: string]: ParamOptions }
}

// TODO: update to keep track of started state
// TODO: subscription to state that needs to be updated in ui (inputNodes/OutputNode, stated state)
class RackNode {
  readonly id: string;

  readonly name: string;

  readonly node: RackAudioNode;

  readonly params?: Map<string, AudioParam>;

  readonly paramOptions?: {[key: string]: ParamOptions };

  readonly outputNode: RackAudioNode;

  readonly analyzer?: AnalyserNode;

  onValueUpdateCallBacks?: ((val: any) => void)[]

  started: boolean;

  inputNodes: Array<InputNode>;

  outPutNodes: Array<OutputNode>;


  constructor(node: AudioNode, opt: RackNodeOptions) {
    this.id = uuid();
    this.node = node;
    this.params = new Map(
      Object
        .entries(classToObject(node) as AudioNodeObject)
        .filter(([key, val]) => (val instanceof AudioParam || key === 'type')),
    );
    this.inputNodes = [];
    this.outPutNodes = [];
    this.name = opt?.name;
    this.paramOptions = opt?.paramOptions;
    this.started = false;
    // FIXME: maybe there is a better way to check if this is not the context
    // destination node
    if (this.name !== 'Destination') {
      const analyzerNode = new AnalyserNode(this.node.context);
      this.analyzer = analyzerNode;
      this.node.connect(analyzerNode);
    }
    // if start 
    // FIXME: we should add to all nodes not just those with start and stop
    // do we need it in front of something like a rackgain node?
    if (this.node?.start) {
      // initializes to off
      const gainNode = new GainNode(this.node.context, { gain: 0 });

      this.node?.start?.();
      this.node.connect(gainNode);

      this.outputNode = gainNode;

    } else {
      this.outputNode = node;
    }
    this.onValueUpdateCallBacks = [];

  }

  set type(value: any) {
    // set node type if exists
    if (this.node.type) {
      this.node.type = value;
      // we might be able to remove this. Not sure tho...
      return;
    }
    // otherqise set this.type
    this.type = value;
  }

  get type() {
    return this.node?.type ?? this.type;
  }

  #connect(output: OutputNode) {
    if (!output.node) return;
    if (output.param) {
      this.outputNode.connect(output.param);
    } else {
      this.outputNode.connect(output.node.node);
    }
  }

  #disconnect(output: OutputNode) {
    if (!output.node) return;
    if (output.param) {
      this.outputNode.disconnect(output.param);
    } else {
      this.outputNode.disconnect(output.node.node);
    }
  }

  start() {
    if (this.node?.start) {
      const now = this.node.context.currentTime;
      this.outputNode?.gain?.setValueAtTime?.(1, now);
      this.started = true;
    }
    return this.started;
  }

  stop() {
    if (this.node?.stop) {
      const now = this.node.context.currentTime;
      this.outputNode?.gain?.setValueAtTime?.(0, now);
      this.started = false;
    }
    return this.started;
  }
 /* cannot call start after stop
  * either combine all nodes that can start and stop with gain nodes 
  * and start means gain is set to 1
  * and stop means gain is set to 0
  */
  toggleStarted() {
    if (!this.node?.start || !this.node?.stop) return false;
    if (this.started) {
      return this.stop();
    } else {
      return this.start();
    }
  }

  onValueUpdate(cb: (val: any) => void) {
    if (typeof cb === "function"){
      this.onValueUpdateCallBacks?.push(cb);
    }
  }

  invokeOnValueUpdateCallbacks(val: any) {
    console.log('on value update onValueUpdateCallBacks len: ', this.onValueUpdateCallBacks?.length)
    this.onValueUpdateCallBacks?.forEach((cb) => cb(val));
  }

  createOutput(id: string, color: string, node?: RackNode, param?: string) {
    const output = new OutputNode(id, color, node, node?.params?.get(param ?? ''), param);
    this.#connect(output);
    this.outPutNodes.push(output);
    return output;
  }

  createInput(id: string, color: string, node?: RackNode, param?: string) {
    const input = new InputNode(id, color, node, node?.params?.get(param ?? ''), param);
    this.inputNodes.push(input);
    return input;
  }

  removeInput(id: string): InputNode | undefined {
    const input = this.inputNodes.find((node) => node.connectionId === id);

    if (!input) {
      return undefined;
    }

    this.inputNodes = this.inputNodes.filter((node) => node.connectionId === id);
    return input;
  }

  removeOutput(id: string): OutputNode | undefined {
    const output = this.outPutNodes.find((node) => node.connectionId === id);

    if (!output) {
      return undefined;
    }

    this.#disconnect(output);
    this.outPutNodes = this.outPutNodes.filter((node) => node.connectionId === id);
    return output;
  }
}

class RackDestinationNode extends RackNode {
  constructor(context:AudioContext) {
    super(context.destination, { name: 'Destination' });
  }
}

export {
  RackNode,
  RackDestinationNode,
  OutputNode,
  InputNode,
};
