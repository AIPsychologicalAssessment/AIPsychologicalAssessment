function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: 12,
        border: "none",
        borderRadius: 6,
        background: disabled ? "#ccc" : "#262A26",
        color: "#fff",
        fontSize: 15,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
