# AI Psychological Assessment — Backend

Spring Boot에서 이미지를 업로드받아 Roboflow YOLO 모델로 분석하고, 진행 상태와 결과를 제공하는 백엔드입니다.

## 배포 주소

https://aipsychologicalassessment-production.up.railway.app/

## 서비스 흐름

```text
심리검사 시작
→ 이미지 업로드
→ 분석 대기
→ 검사 결과 확인
```

현재는 캔버스 그림 대신 이미지 파일 업로드 방식으로 동작합니다.

## 프론트엔드 흐름

### 1. 검사 시작 페이지

```text
/
```

`심리검사 시작하기` 버튼을 누르면 이미지 업로드 페이지로 이동합니다.

### 2. 이미지 업로드 페이지

```text
/draw.html
```

사용자가 이미지를 선택하고 `완료` 버튼을 누르면 다음 API를 호출합니다.

```http
POST /api/assessments
Content-Type: multipart/form-data
```

요청 필드:

```text
image: 이미지 파일
```

응답으로 받은 `assessmentId`를 URL에 포함해 대기 페이지로 이동합니다.

```text
/waiting.html?id={assessmentId}
```

### 3. 분석 대기 페이지

```text
/waiting.html?id={assessmentId}
```

프론트엔드는 일정 간격으로 검사 상태를 조회합니다.

```http
GET /api/assessments/{assessmentId}/status
```

상태가 `COMPLETED`가 되면 결과 페이지로 이동합니다.

```text
/result.html?id={assessmentId}
```

상태가 `FAILED`이면 오류 메시지를 표시합니다.

### 4. 결과 페이지

```text
/result.html?id={assessmentId}
```

다음 API를 호출해 검사 결과를 조회합니다.

```http
GET /api/assessments/{assessmentId}/result
```

결과 페이지에는 다음 내용을 표시합니다.

- 결과 요약
- 객체탐지 원본 JSON
- 결과 사용 시 주의사항
- 처음 화면으로 돌아가기 버튼

## 기술 스택

- Java 17
- Spring Boot
- Gradle
- Roboflow YOLO26 Nano
- Railway
- HTML
- JavaScript

## 주요 API

| Method | URL | 설명 |
|---|---|---|
| `GET` | `/health` | 서버 상태 확인 |
| `POST` | `/detect` | 이미지 객체탐지 |
| `POST` | `/api/assessments` | 검사 생성 및 비동기 분석 시작 |
| `GET` | `/api/assessments/{id}/status` | 검사 진행 상태 조회 |
| `GET` | `/api/assessments/{id}/result` | 검사 결과 조회 |

## 페이지

| URL | 기능 |
|---|---|
| `/` | 검사 시작 |
| `/draw.html` | 이미지 업로드 |
| `/waiting.html?id={검사ID}` | 분석 대기 |
| `/result.html?id={검사ID}` | 결과 확인 |

## 환경변수

```text
ROBOFLOW_API_KEY
ROBOFLOW_MODEL_ID
PORT
```

`PORT`가 없으면 기본값 `8080`을 사용합니다.

## 로컬 실행

```bash
cd Backend
./gradlew bootRun
```

접속:

```text
http://localhost:8080
```

## 참고

- 현재 검사 상태는 서버 메모리에 저장되므로 서버가 재시작되면 기존 검사 정보가 사라집니다.
- 현재 결과는 객체탐지 기반 기능 검증용이며 심리 진단이나 의료적 판단에 사용할 수 없습니다.
- 실제 서비스 전에는 학습 데이터 확장과 모델 성능 검증이 필요합니다.
