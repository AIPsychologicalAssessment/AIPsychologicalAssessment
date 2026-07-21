import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./DrawingCanvas.module.css";

const COLORS = ["#262A26", "#4F6D5D", "#C99A3F", "#6A85A3", "#B94A48"];

const DrawingCanvas = forwardRef(function DrawingCanvas(_, ref) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(3);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useImperativeHandle(ref, () => ({
    getImageData: () => canvasRef.current.toDataURL("image/png"),
    isEmpty: () => !hasDrawing,
    clear: () => clearCanvas(),
  }));

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    if (e.touches) e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={styles.canvas}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <div className={styles.toolbar}>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`${styles.swatch} ${color === c ? styles.swatchActive : ""}`}
            style={{ background: c }}
            aria-label={`색상 ${c}`}
          />
        ))}

        <input
          type="range"
          min="1"
          max="15"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className={styles.range}
        />
        <span className={styles.rangeLabel}>{lineWidth}px</span>
      </div>

      <button className={styles.clearButton} onClick={clearCanvas}>
        지우기
      </button>
    </div>
  );
});

export default DrawingCanvas;
