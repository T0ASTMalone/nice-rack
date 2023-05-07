import { RackNode } from "../../../../types/RackTypes";
import { scaleValue } from "../../../../utils/scale-values";

export function drawPassFilter(ctx: CanvasRenderingContext2D, node: BiquadFilterNode, posX: number) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(224, 194, 252)';
    ctx.beginPath();
    ctx.moveTo(node.type === 'highpass' ? ctx.canvas.width : 0, ctx.canvas.height / 2);

    if (node.type !== 'allpass') {
      ctx.lineTo(posX - (100 * (node.Q.value) * (node.type === 'highpass' ? -1 : 1)), ctx.canvas.height / 2); 
      ctx.lineTo(posX, ctx.canvas.height); 
    } else {
      ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2); 
    }

    ctx.stroke();
}

export function drawBandPass(ctx: CanvasRenderingContext2D, node: BiquadFilterNode, posX: number) {
  ctx.lineWidth;
  ctx.strokeStyle = 'rgb(224, 194, 252)';
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height);
  ctx.lineTo(posX - (100 - getQ(node)), ctx.canvas.height);
  ctx.lineTo(posX, ctx.canvas.height / 2 - getGain(ctx, node));
  ctx.lineTo(posX, ctx.canvas.height / 2 - getGain(ctx, node));
  ctx.lineTo(posX + (100 - getQ(node)), ctx.canvas.height);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
  ctx.stroke();
  
}

function getQ(node: BiquadFilterNode) {
  return 100 * node.Q.value;
}

function getGain(ctx: CanvasRenderingContext2D, node: BiquadFilterNode) {
  return ctx.canvas.height / 2 / 12 * node.gain.value
}

function isLowshelf(type: BiquadFilterType) {
  return type === 'lowshelf';
}

export function drawShelf(ctx: CanvasRenderingContext2D, node: BiquadFilterNode, posX: number) {
  ctx.lineWidth;
  ctx.strokeStyle = 'rgb(224, 194, 252)';

  ctx.beginPath();
  ctx.moveTo(
    0, 
    ctx.canvas.height / 2 - (isLowshelf(node.type) ?  getGain(ctx, node): 0)
  );
  ctx.lineTo(
    posX - (!isLowshelf(node.type) ? getQ(node) : 0),  
    ctx.canvas.height / 2 - (isLowshelf(node.type) ?  getGain(ctx, node) : 0)
  );
  ctx.lineTo(
    posX + (isLowshelf(node.type) ? getQ(node) : 0), 
    ctx.canvas.height / 2 - (!isLowshelf(node.type) ?  getGain(ctx, node) : 0)
  );
  ctx.lineTo(
    ctx.canvas.width, 
    ctx.canvas.height / 2 - (!isLowshelf(node.type) ?  getGain(ctx, node) : 0)
  );
  ctx.stroke();
}

export function drawNotch(ctx: CanvasRenderingContext2D, node: BiquadFilterNode, posX: number) {
  ctx.lineWidth;
  ctx.strokeStyle = 'rgb(224, 194, 252)';
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height / 2);
  ctx.lineTo(posX - 5 - getQ(node), ctx.canvas.height / 2);
  ctx.lineTo(posX - 5, ctx.canvas.height);
  ctx.moveTo(posX + 5, ctx.canvas.height);
  ctx.lineTo(posX + 5 + getQ(node), ctx.canvas.height / 2);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
  ctx.stroke();
}

export function drawPeak(ctx: CanvasRenderingContext2D, node: BiquadFilterNode, posX: number) {
  ctx.lineWidth;
  ctx.strokeStyle = 'rgb(224, 194, 252)';
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height / 2);
  ctx.lineTo(posX - getQ(node), ctx.canvas.height / 2);
  ctx.lineTo(posX, ctx.canvas.height / 2 - getGain(ctx, node));
  ctx.lineTo(posX + getQ(node), ctx.canvas.height / 2);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
  ctx.stroke()
}

export function drawFrequencyBars(ctx: CanvasRenderingContext2D, node?: AnalyserNode) {
  if (!node) {
    return;
  }
  const dataArray = new Uint8Array(node.frequencyBinCount);
  node.getByteFrequencyData(dataArray);

  for (let i = 0; i < node.frequencyBinCount; i++) {
    ctx.fillStyle = `rgba(128, 128, 128,  ${dataArray[i] / 255})`;
    ctx.fillRect(
      scaleValue((i * 1.2 * ctx.canvas.width) / node.frequencyBinCount), 
      ctx.canvas.height - ((dataArray[i] / 1.3) / 2),
      (ctx.canvas.width / node.frequencyBinCount) * 2.5,
      dataArray[i] / 2,
    );
  }
}

export function drawFilter(ctx: CanvasRenderingContext2D | null, node: RackNode<BiquadFilterNode>) {
  if (!ctx || !node?.node) {
    return;
  }

  ctx.fillStyle = 'rgba(40, 44, 52, 1)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawFrequencyBars(ctx, node.analyzer);
  switch (node.type) {
    case 'notch':
      drawNotch(
        ctx,
        node.node,
        scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
      );
      break;
    case 'peaking':
      drawPeak(
        ctx,
        node.node,
        scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
      );
      break;
    case 'bandpass':
      drawBandPass(
        ctx,
        node.node,
        scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
      );
      break;
    case 'highshelf':
    case 'lowshelf':
      drawShelf(
        ctx,
        node.node,
        scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
      );
      break;
    default:
      drawPassFilter(
        ctx,
        node.node,
        scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
      );
  }
}
