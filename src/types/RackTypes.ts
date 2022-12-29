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
}

class RackNode {
  readonly id: string;

  readonly name: string;

  readonly node: RackAudioNode;

  readonly params?: Map<string, AudioParam>;

  inputNodes: Array<InputNode>;

  outPutNodes: Array<OutputNode>;

  constructor(node: AudioNode, name: string) {
    this.id = uuid();
    this.node = node;
    this.params = new Map(
      Object
        .entries(classToObject(node) as AudioNodeObject)
        .filter(([key, val]) => (val instanceof AudioParam || key === 'type')),
    );
    this.inputNodes = [];
    this.outPutNodes = [];
    this.name = name;
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
    console.log('#connect')
    if (!output.node) return;
    console.log('#connect connecting')
    if (output.param) {
      console.log('#connect connecting to param')
      this.node.connect(output.param);
    } else {
      console.log('#connect connecting to node')
      this.node.connect(output.node.node);
    }
  }

  #disconnect(output: OutputNode) {
    if (!output.node) return;
    if (output.param) {
      this.node.disconnect(output.param);
    } else {
      this.node.disconnect(output.node.node);
    }
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
    super(context.destination, 'Destination');
  }
}

export {
  RackNode,
  RackDestinationNode,
  OutputNode,
  InputNode,
};
