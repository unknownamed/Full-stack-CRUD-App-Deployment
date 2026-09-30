# Focus Todos 구현 정리

[프로젝트 README](README.md) · [초기 요구사항](README.md#original-readme-preserved)

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

---

## 기존 결과 문서 전체 내용

# 🚀 Full-stack Todo App: Architecture & Results / 프로젝트 아키텍처 및 결과 문서

This document explains the technical decisions, architecture, and running instructions for the Focus Todo application.
이 문서는 Focus Todo 애플리케이션의 기술적 의사결정, 아키텍처 및 실행 가이드를 설명합니다.

---

## 1. 기술 스택 선정 이유 (Why this Tech Stack?)

### ⚛️ Frontend: React + Vite + Tailwind CSS
- **React**: 컴포넌트(Component) 기반으로 UI를 재사용하기 쉽고, 생태계가 압도적으로 커서 문제 해결이 쉽습니다. (Component-based architecture and massive ecosystem).
- **Vite**: 기존의 Create React App(CRA)보다 빌드 속도와 개발 서버 구동 속도(HMR)가 수십 배 빠릅니다. (Lightning fast HMR and build times compared to CRA).
- **Tailwind CSS**: 별도의 CSS 파일을 왔다갔다 할 필요 없이 HTML 클래스 이름만으로 빠르고 직관적인 디자인이 가능합니다. (Utility-first CSS for rapid UI development).

### 🟢 Backend: Node.js + Express
- **Express**: 자바스크립트 하나로 프론트엔드와 백엔드를 모두 작성할 수 있어 학습 곡선이 낮고 개발 속도가 빠릅니다. 불필요한 기능 없이 가볍게 REST API를 구축하기 좋습니다. (Lightweight, unopinionated framework. Allows using JavaScript everywhere).

### 🍃 Database: MongoDB Atlas
- **MongoDB (NoSQL)**: 정해진 표(Table) 구조가 없어서 데이터 모델을 언제든 유연하게 바꿀 수 있습니다. JSON 형태로 데이터를 다루기 때문에 자바스크립트(Node.js)와 찰떡궁합입니다. (Flexible schema, native JSON support makes it perfect for JavaScript apps).

### ☁️ Deployment: Vercel
- **Vercel**: GitHub에 푸시(Push)만 하면 자동으로 프론트엔드와 백엔드(Serverless Functions)를 동시에 무료로 배포해 주는 최고의 플랫폼입니다. (Zero-config deployments for monorepos).

---

## 2. 아키텍처 및 폴더 구조 (Architecture & Directory Structure)

이 프로젝트는 소프트웨어 공학의 표준 디자인 패턴 중 하나인 **MVC (Model-View-Controller) 패턴**의 철학을 차용하여 백엔드를 분리했습니다.

```text
📦todo-app-root
 ┣ 📂backend/               # 🟢 백엔드 서버 (Node.js)
 ┃ ┣ 📂config/              # ⚙️ 데이터베이스 연결 등 환경 설정 (db.js)
 ┃ ┣ 📂controllers/         # 🧠 핵심 비즈니스 로직 (API 기능 구현) (todoController.js)
 ┃ ┣ 📂models/              # 📁 데이터베이스 스키마 정의 (몽고DB 구조) (Todo.js)
 ┃ ┣ 📂routes/              # 🛣️ URL 경로를 컨트롤러와 연결 (todoRoutes.js)
 ┃ ┣ 📜.env                 # 🔑 민감한 환경변수 (DB 비밀번호 등 - 절대 Git에 올리지 않음!)
 ┃ ┗ 📜index.js             # 🚀 서버 구동의 메인 진입점
 ┣ 📂frontend/              # ⚛️ 프론트엔드 UI (React)
 ┃ ┣ 📂src/                 # ✨ 실제 화면 컴포넌트 및 CSS 파일 (App.jsx, main.jsx 등)
 ┃ ┣ 📜package.json         # 📦 프론트엔드 패키지 목록
 ┃ ┗ 📜vite.config.js       # ⚡ Vite 빌드 도구 설정
 ┣ 📜vercel.json            # ☁️ Vercel 서버리스 배포 라우팅 설정 파일
 ┗ 📜README.md              # 📖 프로젝트 메인 설명서 및 과제 요구사항
```

- **Model (`backend/models`)**: 데이터가 어떻게 생겼는지 정의합니다 (Todo의 제목, 완료 여부 등).
- **View (`frontend/src`)**: 사용자가 실제로 보는 화면입니다 (React UI).
- **Controller (`backend/controllers`)**: 사용자의 요청을 받아 데이터를 수정하거나 가져오는 '두뇌' 역할입니다.

---

## 3. 실행 화면 및 결과 (Screenshots)

*(아래 공간은 전체 세팅 후 직접 스크린샷을 찍어 삽입할 수 있는 자리입니다. Placeholder for screenshots)*

### 📸 메인 화면 작동 결과 (Main Application Interface & Verification)
> 제가 직접 가상 브라우저를 통해 'Hello from Antigravity!' 항목을 데이터베이스에 연동하여 추가한 실제 작동 영상입니다. 추가, 로딩, UI 전환이 모두 완벽합니다.
> ![Verify App Video](C:/Users/user/.gemini/antigravity/brain/185a1220-72be-431c-b1af-04c16360b266/frontend_todo_verification_1774004004995.webp)

### 📸 서버 및 DB 연동 확인 (Server & DB Connection)
> 터미널에서 백엔드와 몽고DB가 정상적으로 연결된 모습입니다.
> ![Terminal Output](./docs/images/terminal_placeholder.png)

---

## 4. 로컬에서 실행하는 방법 (How to run locally)

이제 모든 파일이 다 준비되었습니다! 터미널(명령 프롬프트)을 **두 개** 열어서 각각 아래 명령어를 순서대로 입력하세요.

### 터미널 1: 백엔드 실행 (Backend)
```bash
cd backend
npm install
npm run dev
```
👉 `MongoDB 연결 성공` 이라는 메시지가 뜨면 성공입니다! (포트 5000번)

### 터미널 2: 프론트엔드 실행 (Frontend)
```bash
cd frontend
npm install
npm run dev
```
👉 `http://localhost:5173` 링크가 나타나면 성공입니다! `CTRL + 클릭`으로 브라우저를 열어주세요.

---
개발: User & Antigravity AI Assistant 🤖
