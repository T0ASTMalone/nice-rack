import useCanvas from '../../hooks/useCanvas';

interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  draw: (ctx: CanvasRenderingContext2D | null) => void;
}

export default function Canvas({ draw, ...rest }: CanvasProps) {
  const canvasRef = useCanvas(draw);
  return <canvas ref={canvasRef} {...rest}></canvas>;
};
