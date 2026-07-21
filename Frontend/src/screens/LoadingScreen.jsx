import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { requestAnalysis } from "../services/analysisService";

function LoadingScreen() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const requested = useRef(false);

  useEffect(() => {
    const imageData = location.state?.imageData;

    // 새로고침 등으로 이미지 데이터 없이 접근한 경우 그리기 화면으로 돌려보냄
    if (!imageData) {
      navigate(`/draw/${testId}`, { replace: true });
      return;
    }

    if (requested.current) return;
    requested.current = true;

    requestAnalysis(testId, imageData)
      .then((result) => {
        navigate(`/result/${testId}`, { state: { result }, replace: true });
      })
      .catch((error) => {
        navigate(`/draw/${testId}`, {
          replace: true,
          state: { errorMessage: error.message },
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>그림을 분석하고 있어요</h2>
      <div
        style={{
          margin: "40px auto",
          width: 48,
          height: 48,
          border: "5px solid #eee",
          borderTop: "5px solid #262A26",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ color: "#888", fontSize: 14 }}>
        AI가 그림의 특징을 분석하는 중입니다. 잠시만 기다려주세요.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
