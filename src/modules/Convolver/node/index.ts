import { RackAudioParam, RackNode } from "../../../types/RackTypes";

// modules.json node name
export default class Convolver extends RackNode<ConvolverNode> {
  timer?: NodeJS.Timer;
  constructor(context: AudioContext) {
    super(context, { name: 'Convolver' });
  }

  impulsResponse(duration: number, decay: number, reverse: boolean) {
    let sampleRate = this.context.sampleRate;
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

  update() {
    // debouncing for now since updating the impuls response is pretty expensive
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (this.node) {
        this.node.buffer = this.impulsResponse(
          this.params?.get('duration')?.value ?? 4, 
          this.params?.get('decay')?.value ?? 4, 
          false
        );
      }
    }, 200);
  }

  async init(opt?: ConvolverOptions) {
    this.node = new ConvolverNode(this.context, opt);
    // setting up custom params
    if (!this.params) {
      this.params = new Map();
    }
    this.params.set('duration', new RackAudioParam('duration', 1, 4, 10, .01, 'a-rate', this));
    this.params.set('decay', new RackAudioParam('decay', 1, 4, 5, .01, 'a-rate', this));
    this.update();
    this.numberOfInputs = 10;
    return this;
  }
}
