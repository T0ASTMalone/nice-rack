import { useRef, useEffect } from "react";

const useCanvas = (draw: (ctx: CanvasRenderingContext2D | null) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef?.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount++;
      frameCount % 10 === 0 && draw(context);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [draw, canvasRef?.current]);

  return canvasRef;
};

export default useCanvas;
