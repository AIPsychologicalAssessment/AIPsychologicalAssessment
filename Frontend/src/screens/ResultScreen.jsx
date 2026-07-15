import { useParams } from "react-router-dom";

function ResultScreen() {
  const { testId } = useParams();

  return (
    <div style={{ padding: 24 }}>
      <h2>{testId} 검사 결과</h2>
      <p>감정 키워드: 안정감, 신중함, 약간의 긴장</p>
      <p>정서 안정 지수: 72</p>
      <p>
        해석 요약: 전반적으로 안정된 정서 상태가 나타나며, 그림 구조에서 신뢰와
        소속감이 반영되어 있습니다.
      </p>
    </div>
  );
}

export default ResultScreen;
