import { Canvas } from "../../../../components/Canvas"
import { RackNode } from "../../../../types/RackTypes";
import { scaleValue } from "../../../../utils/scale-values";

type FilterVisualizerProps = {
  node: RackNode<BiquadFilterNode>;
}

function drawPassFilter(node: BiquadFilterNode, ctx: CanvasRenderingContext2D, posX: number) {
    let startX = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(224, 194, 252)';
    if (node.type === 'highpass') {
      startX = ctx.canvas.width;
    }
    const q = 100 * (node.Q.value) * (node.type === 'highpass' ? -1 : 1);
    ctx.beginPath();
    ctx.moveTo(startX, ctx.canvas.height / 2);
    if (node.type !== 'allpass') {
      ctx.lineTo(posX - q, ctx.canvas.height / 2); 
      ctx.lineTo(posX, ctx.canvas.height); 
    } else {
      ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2); 
    }
    ctx.stroke();
}

function drawBandPass(node: BiquadFilterNode, ctx: CanvasRenderingContext2D, posX: number) {
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

function drawShelf(node: BiquadFilterNode, ctx: CanvasRenderingContext2D, posX: number) {
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

function drawNotch(node: BiquadFilterNode, ctx: CanvasRenderingContext2D, posX: number) {
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

function drawPeak(node: BiquadFilterNode, ctx: CanvasRenderingContext2D, posX: number) {
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

function FilterVisualizer({ node, ...rest }: FilterVisualizerProps) {
  function draw(ctx: CanvasRenderingContext2D | null) {
    if (!ctx || !node?.node) {
      return;
    }
    
    ctx.fillStyle = 'rgba(40, 44, 52, 1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    switch(node.type) {
      case 'notch':
        drawNotch(
          node.node,
          ctx,
          scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
        );
        break;
      case 'peaking':
        drawPeak(
          node.node,
          ctx,
          scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
        );
        break;
      case 'bandpass':
        drawBandPass(
          node.node, 
          ctx, 
          scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
        );
        break;
      case 'highshelf':
      case 'lowshelf':
        drawShelf(
          node.node, 
          ctx, 
          scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
        );
        break;
      default:
        drawPassFilter(
          node.node, 
          ctx, 
          scaleValue((node.node?.frequency.value * ctx.canvas.width) / node.node?.frequency.maxValue),
        );
    }
  }

  return (
    <div className="audio-visualizer">
      <Canvas className="audio-visualizer__canvas" {...rest} draw={draw} />
    </div>
  )
}

export default FilterVisualizer
