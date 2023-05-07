import { Canvas } from '../Canvas';

import './AudioVisualizer.css';

const AudioVisualizer = ({ node, ...rest }: { node: AnalyserNode }) => {
  // todo update to show more or less resolution if drawing 
  // outside the canvas 
  function cdraw(ctx: CanvasRenderingContext2D | null){
    if (!ctx) {
      return;
    }

    const dataArray = new Uint8Array(node.frequencyBinCount);
    node.getByteTimeDomainData(dataArray);
    ctx.fillStyle = 'rgba(40, 44, 52, 1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(224, 194, 252)';
    ctx.beginPath();

    const sliceWidth = ctx.canvas.width * 1.0 / node.frequencyBinCount;
    let x = 0;

    for(let i = 0; i < node.frequencyBinCount; i++) {
      const y = dataArray[i] / 128.0 * ctx.canvas.height/2;

      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(ctx.canvas.width, ctx.canvas.height/2);
    ctx.stroke();
  }

  return (
      <div className="audio-visualizer">
          <Canvas className="audio-visualizer__canvas" draw={cdraw} {...rest}/>
      </div>

  );
};


export default AudioVisualizer;
