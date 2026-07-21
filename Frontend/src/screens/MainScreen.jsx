import { Link } from "react-router-dom";
import styles from "./MainScreen.module.css";

const TESTS = [
  {
    id: "house",
    name: "집 그리기 검사",
    desc: "가정과 소속감에 대한 심리를 살펴봐요",
  },
  { id: "tree", name: "나무 그리기 검사", desc: "성장과 내면의 힘을 탐색해요" },
  {
    id: "person",
    name: "사람 그리기 검사",
    desc: "자기 인식과 대인관계를 알아봐요",
  },
  {
    id: "background",
    name: "배경 그리기 검사",
    desc: "현재의 정서와 환경을 살펴봐요",
  },
];

function MainScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>AI 그림 심리검사</p>
        <h1 className={styles.title}>그림으로 나를 이해하는 시간</h1>
        <p className={styles.subtitle}>
          원하는 검사를 선택하고 자유롭게 그림을 그려보세요.
        </p>
      </header>

      <ul className={styles.list}>
        {TESTS.map((test) => (
          <li key={test.id} className={styles.item}>
            <Link to={`/draw/${test.id}`} className={styles.card}>
              <div className={styles.cardText}>
                <span className={styles.cardTitle}>{test.name}</span>
                <span className={styles.cardDesc}>{test.desc}</span>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainScreen;
