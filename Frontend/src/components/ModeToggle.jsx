function ModeToggle({ mode, onChange }) {
  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px 0",
    border: "1px solid #ccc",
    background: active ? "#262A26" : "#fff",
    color: active ? "#fff" : "#333",
    cursor: "pointer",
    fontSize: 14,
  });

  return (
    <div style={{ display: "flex", marginBottom: 16, maxWidth: 400 }}>
      <button
        style={{ ...tabStyle(mode === "draw"), borderRadius: "6px 0 0 6px" }}
        onClick={() => onChange("draw")}
      >
        직접 그리기
      </button>
      <button
        style={{ ...tabStyle(mode === "upload"), borderRadius: "0 6px 6px 0" }}
        onClick={() => onChange("upload")}
      >
        이미지 업로드
      </button>
    </div>
  );
}

export default ModeToggle;
