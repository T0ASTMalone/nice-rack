import { RackNode } from "../../../types/RackTypes";

export default class Gain extends RackNode<GainNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Gain',
      paramOptions: {
        // https://stackoverflow.com/questions/22604500/web-audio-api-working-with-decibels
        // using 35db (ableton utility's max db value is 35db)
        // gain.value = Math.pow(10, (35db / 20));
        gain: {  min: 0, max: 56.23413251903491 },
      }
    });
  }

  async init(opt?: GainOptions) {
    this.node = new GainNode(this.context, opt);
    this.numberOfInputs = 3;
    this.numberOfOutputs = 1;
    return this;
  }
}


