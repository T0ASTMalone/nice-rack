import { v4 as uuid } from 'uuid';

class IONode<T extends RackAudioNode> {
  node?: RackNode<T>;

  paramName?: string;

  param?: AudioParam;

  connectionId: string;

  color: string;

  constructor(
    id: string,
    color: string,
    node?: RackNode<T>,
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

const classToObject = (theClass: AudioNode) => {
  const originalClass = theClass || {};

  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));

  return keys.reduce((classAsObj: {[key: string]: any}, key: string) => {
    classAsObj[key] = originalClass[key as keyof AudioNode];
    return classAsObj;
  }, {});
};

const audioParamFilter = ([key, val]: [key: string, val: any]) => (
  val instanceof AudioParam || key === 'type'
);

const getAudioParams = (node: AudioNode) => {
  const entries = Object.entries(classToObject(node)).filter(audioParamFilter);
  return new Map(entries);
}

export interface RackAudioNode extends AudioNode {
  type?: string;
  start?: (when?: number) => void;
  stop?: (when?: number) => void;
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
// TODO: implement interface for the class to implement 
// interface Foo {
//    new(n: string): bar;
// }
// TODO: update to keep track of started state
// TODO: subscription to state that needs to be updated in ui (inputNodes/OutputNode, stated state)
class RackNode<T extends RackAudioNode> {
  readonly id: string;

  readonly name: string;

  readonly outputNode: RackAudioNode;

  readonly context: AudioContext;

  readonly paramOptions?: {[key: string]: ParamOptions };

  readonly analyzer?: AnalyserNode;

  _node?: T;
  
  params?: Map<string, AudioParam>;
  // not being used yet
  onValueUpdateCallBacks?: ((val: any) => void)[]

  started: boolean;

  inputNodes: Array<IONode<T>>;

  outPutNodes: Array<IONode<T>>;

  constructor(context: AudioContext, opt: RackNodeOptions) {
    this.id = uuid();
    this.inputNodes = [];
    this.outPutNodes = [];
    this.started = false;
    this.context = context;
    /*
    this._node = node;
    this.params = getAudioParams(node);
    */
    this.name = opt?.name;
    this.paramOptions = opt?.paramOptions;
    
    if (this.name !== 'Destination') {
      // TODO: pass in context
      const analyzerNode = new AnalyserNode(context);
      this.analyzer = analyzerNode;
      // this._node.connect(analyzerNode);
    }

    this.outputNode = new GainNode(context, { gain: 0 });
    /*
    this._node?.start?.();
    this._node.connect(gainNode);
    */
    this.onValueUpdateCallBacks = [];

  }

  set type(value: any) {
    // set node type if exists
    if (this._node?.type) {
      this._node.type = value;
      // we might be able to remove this. Not sure tho...
      return;
    }
    // otherqise set this.type
    this.type = value;
  }

  get type() {
    return this._node?.type ?? this.type;
  }

  set node(node) {
    console.log('running setter');
    if (!node) return;
    this._node = node;
    this.params = getAudioParams(node);
    
    if (this.name !== 'Destination' && this.analyzer) {
      this._node.connect(this.analyzer);
    }
    this._node?.start?.();
    if (this.name !== 'Destination') {
      this._node.connect(this.outputNode);
    }
    this.onValueUpdateCallBacks = [];
  }

  get node() {
    return this._node;
  }

  classToObject(theClass: AudioNode) {
    const originalClass = theClass || {};

    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));

    return keys.reduce((classAsObj: {[key: string]: any}, key: string) => {
      classAsObj[key] = originalClass[key as keyof AudioNode];
      return classAsObj;
    }, {});
  };

  audioParamFilter([key, val]: [key: string, val: any]) {
    return val instanceof AudioParam || key === 'type';
  }

  getAudioParams(node: AudioNode) {
    const entries = Object.entries(this.classToObject(node)).filter(this.audioParamFilter);
    return new Map(entries);
  }

  #connect(output: IONode<T>) {
    if (!output?.node) return;
    if (output.param) {
      this.outputNode.connect(output.param);
    } else {
      if (!output?.node?.node) return;
      this.outputNode.connect(output.node.node);
    }
  }

  #disconnect(output: IONode<T>) {
    if (!output?.node) return;
    if (output.param) {
      this.outputNode.disconnect(output.param);
    } else {
      if (!output?.node?.node) return;
      this.outputNode.disconnect(output.node.node);
    }
  }

  start() {
    if (this._node) {
      const now = this._node.context.currentTime;
      this.outputNode?.gain?.setValueAtTime?.(1, now);
      this.started = true;
    }
    return this.started;
  }

  stop() {
    if (this._node) {
      const now = this._node.context.currentTime;
      this.outputNode?.gain?.setValueAtTime?.(0, now);
      this.started = false;
    }
    return this.started;
  }

  async init(): Promise<RackNode<T>> {
    throw new Error('Method "init()" must be implemented.');
  }

 /* cannot call start after stop
  * either combine all nodes that can start and stop with gain nodes 
  * and start means gain is set to 1
  * and stop means gain is set to 0
  */
  toggleStarted() {
    if (!this._node?.start || !this.node?.stop) return false;
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

  createOutput(id: string, color: string, node?: RackNode<T>, param?: string) {
    const output = new IONode<T>(id, color, node, node?.params?.get(param ?? ''), param);
    this.#connect(output);
    this.outPutNodes.push(output);
    return output;
  }

  createInput(id: string, color: string, node?: RackNode<T>, param?: string) {
    const input = new IONode<T>(id, color, node, node?.params?.get(param ?? ''), param);
    this.inputNodes.push(input);
    return input;
  }

  removeInput(id: string): IONode<T> | undefined {
    const input = this.inputNodes.find((node) => node.connectionId === id);

    if (!input) {
      return undefined;
    }

    this.inputNodes = this.inputNodes.filter((node) => node.connectionId === id);
    return input;
  }

  removeOutput(id: string): IONode<T> | undefined {
    const output = this.outPutNodes.find((node) => node.connectionId === id);

    if (!output) {
      return undefined;
    }

    this.#disconnect(output);
    this.outPutNodes = this.outPutNodes.filter((node) => node.connectionId === id);
    return output;
  }
}

class RackDestinationNode extends RackNode<AudioDestinationNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Destination' });
  }

  async init() {
    this.node = this.context.destination
    return this;
  }
}

export type RackModuleUIProps<T extends RackAudioNode> = { 
  context: AudioContext,
  node: RackNode<T>
};

export type RackModuleUI<T extends RackAudioNode> = React.FunctionComponentElement<
  RackModuleUIProps<T>
>

export type RackModule<T extends RackAudioNode> = {
  ModuleUI: RackModuleUI<T>,
  Node: RackNode<T>
};

export {
  RackNode,
  RackDestinationNode,
  IONode,
};
