import styles from "./ModeToggle.module.css";

function ModeToggle({ mode, onChange }) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.tab} ${mode === "draw" ? styles.active : ""}`}
        onClick={() => onChange("draw")}
      >
        직접 그리기
      </button>
      <button
        className={`${styles.tab} ${mode === "upload" ? styles.active : ""}`}
        onClick={() => onChange("upload")}
      >
        이미지 업로드
      </button>
    </div>
  );
}

export default ModeToggle;
