import { useLocation, useNavigate, useParams } from "react-router-dom";
import mockAnalysisResults from "../data/mockAnalysisResults";
import styles from "./ResultScreen.module.css";

const TEST_NAMES = {
  house: "집 그리기 검사",
  tree: "나무 그리기 검사",
  person: "사람 그리기 검사",
  background: "배경 그리기 검사",
};

function ResultScreen() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result ?? mockAnalysisResults[testId];

  if (!result) {
    return (
      <div className={styles.container}>
        <p>결과를 불러올 수 없습니다.</p>
        <button
          className={styles.retryButton}
          onClick={() => navigate(`/draw/${testId}`)}
        >
          다시 검사하기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {TEST_NAMES[testId] ?? `${testId} 검사`} 결과
      </h2>

      <p className={styles.disclaimer}>
        ※ 본 결과는 AI 기반 참고용 분석이며, 전문적인 심리 진단을 대체하지
        않습니다.
      </p>

      {result.imageData && (
        <img
          src={result.imageData}
          alt="분석한 그림"
          className={styles.resultImage}
        />
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>전체 심리 분석 요약</h3>
        <p className={styles.text}>{result.summary}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>그림에서 관찰된 특징</h3>
        <ul className={styles.list}>
          {result.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>성향 분석</h3>
        <p className={styles.text}>{result.tendency}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>감정 상태</h3>
        <div className={styles.emotionRow}>
          {result.emotion.keywords.map((k) => (
            <span key={k} className={styles.tag}>
              {k}
            </span>
          ))}
        </div>
        <div className={styles.scoreBar}>
          <div
            className={styles.scoreFill}
            style={{ width: `${result.emotion.stabilityScore}%` }}
          />
        </div>
        <p className={styles.scoreLabel}>
          정서 안정 지수 {result.emotion.stabilityScore}
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>심리적 해석</h3>
        <p className={styles.text}>{result.interpretation}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>종합 상담 및 조언</h3>
        <p className={styles.text}>{result.advice}</p>
      </section>

      <button className={styles.homeButton} onClick={() => navigate("/")}>
        메인으로
      </button>
    </div>
  );
}

export default ResultScreen;
