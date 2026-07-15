import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const COLORS = ["#262A26", "#4F6D5D", "#C99A3F", "#6A85A3", "#B94A48"];

function DrawScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    // TODO: canvasRef.current.toDataURL()로 이미지 뽑아서 서버 전송
    navigate(`/result/${testId}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>{testId} 검사</h2>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid #ccc", cursor: "crosshair" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />

      <div
        style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}
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
        <button onClick={handleSubmit} style={{ marginLeft: 8 }}>
          분석 시작하기
        </button>
      </div>
    </div>
  );
}

export default DrawScreen;
