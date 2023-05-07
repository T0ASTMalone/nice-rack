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

// TODO: subscription to state that needs to be updated in ui (inputNodes/OutputNode, stated state)
// this will help when modulating a param and seeing it's value update
// in the ui
class RackNode<T extends RackAudioNode> {
  readonly id: string;

  readonly name: string;

  readonly outputNode: RackAudioNode;

  readonly context: AudioContext;

  readonly paramOptions?: {[key: string]: ParamOptions };

  readonly analyzer?: AnalyserNode;

  #numberOfInputs?: number;
  #numberOfOutputs?: number;

  _node?: T;
  
  protected params?: Map<string, AudioParam> = new Map();
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
    this.name = opt?.name;
    this.paramOptions = opt?.paramOptions;
    this.outputNode = new GainNode(context, { gain: 0 });

    if (this.name !== 'Destination') {
      const analyzerNode = new AnalyserNode(context);
      this.analyzer = analyzerNode;
      this.outputNode.connect(analyzerNode);
    }
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

  protected set numberOfInputs(num: number | undefined) {
    this.#numberOfInputs = num;
  }

  get numberOfInputs(): number | undefined {
    return this.#numberOfInputs;
  }

  protected set numberOfOutputs(num: number | undefined) {
    this.#numberOfOutputs = num;
  }

  get numberOfOutputs(): number | undefined {
    return this.#numberOfOutputs;
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

  toggleStarted() {
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
    console.log(`[removeInput] ${id}`)
    const input = this.inputNodes.find((node) => node.connectionId === id);

    if (!input) {
      console.log('[removeInput] not found')
      return undefined;
    }

    console.log('[removeInput] removing inputs')
    this.inputNodes = this.inputNodes.filter((node) => node.connectionId !== id);
    return input;
  }

  removeOutput(id: string): IONode<T> | undefined {
    console.log(`[removeOutput] ${id}`)
    const output = this.outPutNodes.find((node) => node.connectionId === id);

    if (!output) {
      console.log('[removeOutput] not found')
      return undefined;
    }

    // this.#disconnect(output);
    console.log('[removeOutput] removing outputs')
    this.outPutNodes = this.outPutNodes.filter((node) => node.connectionId !== id);
    return output;
  }

  update() {
    throw Error("Implement me!")
  }
}

export class RackAudioParam<T extends RackAudioNode> implements AudioParam {
  readonly name: string;
  readonly defaultValue: number;
  readonly maxValue: number;
  readonly minValue: number;
  readonly automationRate: AutomationRate;
  readonly _node: RackNode<T>;
  _value: number = 0;

  constructor(
    name: string,
    defaultValue: number,
    value: number, 
    maxValue: number, 
    minValue: number, 
    automationRate: AutomationRate, 
    node: RackNode<T>
  ) {
    this._node = node;
    this.name = name;
    this.defaultValue = defaultValue;
    this.value = value;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.automationRate = automationRate;
  }

  get value() {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    if (this._node) {
      this._node.update();
    }
  }

  /* Non Functional just for types */
  setValueAtTime(value: number, startTime: number): AudioParam {
    return this;    
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
    return this;    
  }

  linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    let a = new AudioParam();
    return this;    
  }

  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    return this;    
  }

  cancelScheduledValues(cancelTime: number): AudioParam {
    return this;    
  }

  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam;
  setValueCurveAtTime(values: Iterable<number>, startTime: number, duration: number): AudioParam;
  setValueCurveAtTime(values: unknown, startTime: unknown, duration: unknown): AudioParam {
    return this;    
  }

  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
    return this;    
  }
  /* End Non Functional */
}

class RackDestinationNode extends RackNode<AudioDestinationNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Destination' });
  }

  async init() {
    this.node = this.context.destination
    this.numberOfInputs = 10;
    return this;
  }
}

export type RackModuleUIProps<T extends RackAudioNode> = { 
  context: AudioContext;
  node: RackNode<T>;
  children?: React.ReactNode;
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
