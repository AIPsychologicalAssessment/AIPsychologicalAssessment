import mockAnalysisResults from "../data/mockAnalysisResults";

const MOCK_DELAY_MS = 2500;

/**
 * 4주차에 실제 AI API를 연결할 때는 이 함수의 내부 구현만 교체하면 됩니다.
 * 예)
 * export async function requestAnalysis(testId, imageData) {
 *   const res = await fetch("/api/analysis", {
 *     method: "POST",
 *     body: JSON.stringify({ testId, imageData }),
 *   });
 *   if (!res.ok) throw new Error("분석 요청에 실패했습니다.");
 *   return res.json();
 * }
 *
 * 호출부(LoadingScreen)는 Promise 기반이라 그대로 유지하면 됩니다.
 */
export function requestAnalysis(testId, imageData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockResult = mockAnalysisResults[testId];

      if (!mockResult) {
        reject(new Error("해당 검사 유형의 결과 데이터를 찾을 수 없습니다."));
        return;
      }

      resolve({
        testId,
        imageData,
        ...mockResult,
        analyzedAt: new Date().toISOString(),
      });
    }, MOCK_DELAY_MS);
  });
}
