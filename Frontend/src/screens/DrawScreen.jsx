import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DrawingCanvas from "../components/DrawingCanvas";
import ImageUploader from "../components/ImageUploader";
import ModeToggle from "../components/ModeToggle";
import PrimaryButton from "../components/PrimaryButton";

const TEST_NAMES = {
  house: "집 그리기 검사",
  tree: "나무 그리기 검사",
  person: "사람 그리기 검사",
  background: "배경 그리기 검사",
};

function DrawScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("draw"); // "draw" | "upload"
  const [guideMessage, setGuideMessage] = useState("");

  const drawingRef = useRef(null);
  const uploadRef = useRef(null);

  const activeRef = mode === "draw" ? drawingRef : uploadRef;

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setGuideMessage("");
  };

  const handleSubmit = () => {
    if (!activeRef.current || activeRef.current.isEmpty()) {
      setGuideMessage(
        mode === "draw"
          ? "그림을 먼저 그려주세요."
          : "이미지를 먼저 선택해주세요.",
      );
      return;
    }

    setGuideMessage("");
    const imageData = activeRef.current.getImageData();
    navigate(`/loading/${testId}`, { state: { imageData } });
  };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h2>{TEST_NAMES[testId] ?? `${testId} 검사`}</h2>

      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "draw" ? (
        <DrawingCanvas ref={drawingRef} />
      ) : (
        <ImageUploader ref={uploadRef} />
      )}

      {guideMessage && (
        <p style={{ color: "#B94A48", fontSize: 13, marginTop: 8 }}>
          {guideMessage}
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        <PrimaryButton onClick={handleSubmit}>분석 시작하기</PrimaryButton>
      </div>
    </div>
  );
}

export default DrawScreen;
