import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styles from "./ImageUploader.module.css";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE_MB = 10;

const ImageUploader = forwardRef(function ImageUploader(_, ref) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  useImperativeHandle(ref, () => ({
    getImageData: () => preview,
    isEmpty: () => !preview,
    clear: () => handleReset(),
  }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("지원하지 않는 이미지 형식입니다. (PNG, JPG, WEBP만 가능)");
      setPreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
      setPreview(null);
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {!preview && (
        <label className={styles.dropzone}>
          <span className={styles.dropzoneIcon}>+</span>
          <span className={styles.dropzoneText}>이미지를 선택해주세요</span>
          <span className={styles.dropzoneHint}>
            PNG / JPG / WEBP, 10MB 이하
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className={styles.input}
          />
        </label>
      )}

      {preview && (
        <div>
          <img
            src={preview}
            alt="업로드한 그림 미리보기"
            className={styles.preview}
          />
          <button className={styles.resetButton} onClick={handleReset}>
            다시 선택
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
});

export default ImageUploader;
