import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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

  // DrawScreen에서 ref로 접근해 이미지 데이터를 꺼내거나 비어있는지 확인할 수 있도록 노출
  useImperativeHandle(ref, () => ({
    getImageData: () => canvasRef.current.toDataURL("image/png"),
    isEmpty: () => !hasDrawing,
    clear: () => clearCanvas(),
  }));

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
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
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{
          border: "1px solid #ccc",
          cursor: "crosshair",
          maxWidth: "100%",
          width: "100%",
          height: "auto",
          aspectRatio: "1 / 1",
          touchAction: "none",
          background: "#fff",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: c,
              border: color === c ? "2px solid #333" : "1px solid #ccc",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        ))}

        <input
          type="range"
          min="1"
          max="15"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          style={{ marginLeft: 12 }}
        />
        <span style={{ fontSize: 12 }}>{lineWidth}px</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={clearCanvas}>지우기</button>
      </div>
    </div>
  );
});

export default DrawingCanvas;
