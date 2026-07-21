import styles from "./PrimaryButton.module.css";

function PrimaryButton({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
