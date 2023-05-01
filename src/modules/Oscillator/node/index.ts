import { RackNode } from '../../../types/RackTypes';

export default class Oscillator extends RackNode<OscillatorNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Oscillator',
      paramOptions: {
        'type':  { values: ['square', 'sine', 'sawtooth'] },
      }
    });
  }
  
  async init(opt?: OscillatorOptions) {
    this.node = new OscillatorNode(this.context, opt);
    return this;
  }
}
