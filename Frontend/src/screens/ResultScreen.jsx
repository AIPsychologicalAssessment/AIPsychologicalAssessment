import { useLocation, useNavigate, useParams } from "react-router-dom";
import mockAnalysisResults from "../data/mockAnalysisResults";

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

  // 정상 흐름(LoadingScreen을 거침)이면 state.result 사용,
  // 새로고침 등 예외 상황이면 mock 데이터로 보정
  const result = location.state?.result ?? mockAnalysisResults[testId];

  if (!result) {
    return (
      <div style={{ padding: 24 }}>
        <p>결과를 불러올 수 없습니다.</p>
        <button onClick={() => navigate(`/draw/${testId}`)}>
          다시 검사하기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2>{TEST_NAMES[testId] ?? `${testId} 검사`} 결과</h2>

      <p
        style={{
          fontSize: 12,
          color: "#888",
          background: "#f5f5f5",
          padding: 10,
          borderRadius: 6,
        }}
      >
        ※ 본 결과는 AI 기반 참고용 분석이며, 전문적인 심리 진단을 대체하지
        않습니다.
      </p>

      {result.imageData && (
        <img
          src={result.imageData}
          alt="분석한 그림"
          style={{
            width: "100%",
            maxWidth: 400,
            border: "1px solid #ccc",
            borderRadius: 8,
            marginTop: 16,
          }}
        />
      )}

      <section style={{ marginTop: 20 }}>
        <h3>전체 심리 분석 요약</h3>
        <p>{result.summary}</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>그림에서 관찰된 특징</h3>
        <ul>
          {result.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>성향 분석</h3>
        <p>{result.tendency}</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>감정 상태</h3>
        <p>감정 키워드: {result.emotion.keywords.join(", ")}</p>
        <p>정서 안정 지수: {result.emotion.stabilityScore}</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>심리적 해석</h3>
        <p>{result.interpretation}</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>종합 상담 및 조언</h3>
        <p>{result.advice}</p>
      </section>

      <div style={{ marginTop: 24 }}>
        <button onClick={() => navigate("/")}>메인으로</button>
      </div>
    </div>
  );
}

export default ResultScreen;
