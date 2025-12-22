'use client';
import useCanvasCursor from '../hooks/useCanvasCursor';

const CanvasCursor = () => {
  useCanvasCursor();
  return (
    <canvas
      id="canvas"
      aria-hidden="true"
      className="canvas-cursor"
    />
  );
};

export default CanvasCursor;
