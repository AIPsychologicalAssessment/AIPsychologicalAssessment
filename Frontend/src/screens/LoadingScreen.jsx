import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { requestAnalysis } from "../services/analysisService";
import styles from "./LoadingScreen.module.css";

function LoadingScreen() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const requested = useRef(false);

  useEffect(() => {
    const imageData = location.state?.imageData;

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
    <div className={styles.container}>
      <h2 className={styles.title}>그림을 분석하고 있어요</h2>
      <div className={styles.spinner} />
      <p className={styles.description}>
        AI가 그림의 특징을 분석하는 중입니다.
        <br />
        잠시만 기다려주세요.
      </p>
    </div>
  );
}

export default LoadingScreen;
