import useCanvas from '../../hooks/useCanvas';

import './AudioVisualizer.css';

const Canvas = (props: any) => {
  const { draw, ...rest } = props;
  const canvasRef = useCanvas(draw);
  return <canvas ref={canvasRef} {...rest}></canvas>;
};


const AudioVisualizer = ({ node, ...rest }: { node: AnalyserNode }) => {
  // todo update to show more or less resolution if drawing 
  // outside the canvas 
  function cdraw(ctx: CanvasRenderingContext2D){
    var bufferLength = node.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    // let drawVisual = requestAnimationFrame(cdraw);
    node.getByteTimeDomainData(dataArray);
    // console.log(bufferLength);
    ctx.fillStyle = 'rgba(40, 44, 52, 1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(224, 194, 252)';
    ctx.beginPath();

    var sliceWidth = ctx.canvas.width * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * ctx.canvas.height/2;

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
