import { RackNode } from '../../../types/RackTypes';

export default class Oscillator extends RackNode<OscillatorNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Oscillator',
      paramOptions: {
        type:  { values: ['square', 'sine', 'sawtooth'] },
        frequency: { min: 0, max: 12800 },
        detune: { min: -6400, max: 6400 },
      }
    });
  }
  
  async init(opt?: OscillatorOptions) {
    this.node = new OscillatorNode(this.context, opt);
    this.numberOfOutputs = 10;
    return this;
  }
}
