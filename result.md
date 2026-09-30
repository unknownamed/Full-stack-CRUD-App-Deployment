# Focus Todos 구현 정리

[프로젝트 README](README.md) · [초기 요구사항](docs/project-brief.md)

## 화면과 데이터 흐름

React의 `App.jsx`에서 Axios로 할 일을 조회·추가·완료·삭제합니다. 로컬은 Express 서버를, 배포 환경은 같은 도메인의 `/api/todos`를 호출합니다.

![로컬 전체 CRUD 흐름](docs/images/todo-desktop-demo.gif)

## 백엔드

| 구성 | 역할 |
| --- | --- |
| `index.js` | Express·CORS·JSON 파싱, MongoDB 연결, API 라우팅 |
| `routes/todoRoutes.js` | GET·POST·PUT·DELETE와 컨트롤러 연결 |
| `controllers/todoController.js` | 목록·생성·완료 상태 변경·삭제 |
| `models/Todo.js` | 제목·완료 여부·타임스탬프 저장 |

## 배포

`vercel.json`에서 프론트엔드를 정적 빌드하고, `/api/*` 요청을 Node 백엔드로 연결합니다. MongoDB 연결에는 배포 환경의 `MONGODB_URI`가 필요합니다.

## 구현 범위

개인 CRUD·배포 실습으로 Antigravity를 활용했습니다. 인증과 사용자별 데이터 분리는 구현되어 있지 않고, PUT은 완료 여부만 바꿉니다. 로컬 실행 방법과 요청 본문은 README에 정리했습니다.
