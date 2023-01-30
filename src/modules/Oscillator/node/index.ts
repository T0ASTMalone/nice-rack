import { RackNode } from '../../../types/RackTypes';

export default class RackOscillatorNode extends RackNode {
  constructor(context: AudioContext, opt?: OscillatorOptions) {
    super(new OscillatorNode(context, opt), { 
      name: 'Oscillator',
      paramOptions: {
        'type':  { values: ['square', 'sine', 'sawtooth'] },
      }
    });
  }
}
