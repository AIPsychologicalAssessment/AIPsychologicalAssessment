import { Link } from "react-router-dom";

const TESTS = [
  { id: "house", name: "집 그리기 검사" },
  { id: "tree", name: "나무 그리기 검사" },
  { id: "person", name: "사람 그리기 검사" },
  { id: "background", name: "배경 그리기 검사" },
];

function MainScreen() {
  return (
    <div style={{ padding: 24 }}>
      <h1>그림 심리검사</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {TESTS.map((test) => (
          <li key={test.id} style={{ marginBottom: 12 }}>
            <Link to={`/draw/${test.id}`}>
              <button style={{ width: "100%", padding: 12 }}>
                {test.name} 바로가기
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainScreen;
