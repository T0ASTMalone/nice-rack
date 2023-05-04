import { RackNode } from "../../../types/RackTypes";

// TODO: finish implementing and use to add custom audio params to racknodes 
// on init or in constructor
class RackAudioParam implements AudioParam {
  readonly defaultValue: number;
  readonly value: number;
  readonly maxValue: number;
  readonly minValue: number;
  readonly automationRate: AutomationRate;

  constructor(defaultValue: number, value: number, maxValue: number, minValue: number, automationRate: AutomationRate) {
    this.defaultValue = defaultValue;
    this.value = value;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.automationRate = automationRate;
  }
  
  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    // return new AudioParam().cancelAndHoldAtTime(cancelTime);
  }

}

// modules.json node name
export default class Convolver extends RackNode<ConvolverNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Convolver'
      // TODO: add params
    });
  }

  impulsResponse(duration: number, decay: number, reverse: boolean) {
    let sampleRate = this.context.sampleRate;
    console.log('sampleRate', sampleRate);
    let length = sampleRate * duration;
    let impulse = this.context.createBuffer(2, length, sampleRate);
    let impulseL = impulse.getChannelData(0);
    let impulseR = impulse.getChannelData(1);

    if (!decay) {
      decay = 2.0;
    }

    for (let i = 0; i < length; i++) {
      const n = reverse ? length - 1 : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay); 
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay); 
    }

    return impulse;

  }

  async init(opt?: ConvolverOptions) {
    this.node = new ConvolverNode(this.context, opt);
    this.node.buffer = this.impulsResponse(4, 4, false);
    this.numberOfInputs = 10;
    return this;
  }
}
