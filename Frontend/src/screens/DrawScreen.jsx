import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DrawScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("draw"); // draw | upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const isDrawing = useRef(false);

  const startDraw = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // TODO: 캔버스 이미지 또는 업로드 이미지를 서버로 전송 후 결과 받기
    navigate(`/result/${testId}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>{testId} 검사</h2>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setMode("draw")} disabled={mode === "draw"}>
          화면에 그리기
        </button>
        <button onClick={() => setMode("upload")} disabled={mode === "upload"}>
          사진 업로드
        </button>
      </div>

      {mode === "draw" ? (
        <div>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            style={{ border: "1px solid #ccc" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
          <div>
            <button onClick={clearCanvas}>지우기</button>
          </div>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploadedImage && (
            <div>
              <img src={uploadedImage} alt="업로드 미리보기" width={300} />
            </div>
          )}
        </div>
      )}

      <button style={{ marginTop: 16 }} onClick={handleSubmit}>
        분석 시작하기
      </button>
    </div>
  );
}

export default DrawScreen;
