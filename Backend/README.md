# AI Psychological Assessment — Backend

Spring Boot에서 이미지를 업로드받아 Roboflow YOLO 모델로 객체탐지를 수행하고, 결과를 JSON으로 반환하는 백엔드입니다.

## 배포 주소

- 테스트 페이지: https://aipsychologicalassessment-production.up.railway.app/
- 서버 상태 확인: https://aipsychologicalassessment-production.up.railway.app/health
- 객체탐지 API: `POST https://aipsychologicalassessment-production.up.railway.app/detect`

## 기술 스택

- Java 17
- Spring Boot
- Gradle
- Roboflow YOLO26 Nano
- Railway

## 주요 기능

- `GET /health` 서버 상태 확인
- `POST /detect` 이미지 객체탐지
- JPEG, PNG, WEBP 지원
- 최대 10MB 업로드
- 브라우저 테스트 페이지 제공

## 환경변수

```text
ROBOFLOW_API_KEY
ROBOFLOW_MODEL_ID
PORT
```

`PORT`를 설정하지 않으면 기본값 `8080`을 사용합니다.

## 로컬 실행

```bash
cd Backend
./gradlew bootRun
```

접속:

```text
http://localhost:8080
```

## 객체탐지 API

```http
POST /detect
Content-Type: multipart/form-data
```

요청 필드:

```text
image: 이미지 파일
```

배포 서버 호출 예시:

```bash
curl -X POST   https://aipsychologicalassessment-production.up.railway.app/detect   -F "image=@sample.jpg"
```

> 현재 모델은 기능 검증용으로 학습 데이터가 적어 실제 서비스 전 데이터 확장과 성능 검증이 필요합니다.
