# 박승주 포트폴리오

한옥과 텃밭을 산책하며 프로젝트와 경험을 둘러보는 게임형 포트폴리오, **승주의 섬** 🌿

## 배포 방법
1. GitHub에서 저장소 이름을 `Zoe3399.github.io`로 새로 만듭니다 (Public).
2. 이 폴더의 HTML 파일 전체와 `assets/`, `posts/`를 저장소 루트에 업로드합니다. `assets/css/`와 `assets/js/`도 함께 올려 주세요.
3. Settings → Pages → Branch를 `main` / `(root)`로 저장합니다.
4. 1~2분 뒤 https://zoe3399.github.io 에서 확인합니다.


## 페이지 구성
- `index.html` : 게임형 섬 (방향키 + Space, 모바일은 방향 패드 + A)
- `list.html` : 스크롤로 한 번에 보는 버전
- `classic.html` : 깔끔한 기본 디자인
- `blog.html` : 일기장(블로그)
- `assets/css/island.css` : 게임 화면과 팝업 디자인
- `assets/css/reading.css` : 목록·일기장 공통 디자인
- `assets/js/island.js` : 게임, 이동, 메뉴 및 사진 기반 주민 캐릭터
- `assets/js/island-motion.js` : 원근 카메라, 좌표 변환, 걷기·달리기 물리
- `assets/js/villager-motion.js` : 사진 기반 머리와 관절식 몸체를 결합한 네 방향 보행
- `assets/js/island-scenery.js` : 나무·소품과 목재·천·작물의 표현
- `assets/js/scenery-source.js` : 로컬 파일에서도 동작하는 배경 이미지 데이터
- `assets/img/scenery/SOURCES.md` : 배경 이미지 출처와 권리 표기
- `assets/js/villager-source.js` : 로컬 파일에서도 캐릭터가 표시되도록 포함한 이미지 데이터
- `DESIGN-NOTES.md` : 디자인 참고 자료, 수정 내역, 검증 결과와 캐릭터 제작 프롬프트

섬 메뉴(T) 또는 하단 아이콘으로 내용을 바로 열 수 있습니다. 방향키/WASD로 이동하고 Shift를 누르면 달립니다. 바닥을 클릭해 이동하고 Space로 살펴보며, Esc로 상세창을 닫습니다. 작은 화면에서는 방향 패드와 A 버튼을 사용합니다.

## 일기장에 글 쓰는 법
1. `posts/` 폴더에 `2026-10-제목.md` 같은 마크다운 파일을 만듭니다.
2. `posts/posts.json`에 한 줄 추가합니다.
   ```json
   {"id":"2026-10-제목","title":"글 제목","date":"2026-10-01","tags":["회고"],"summary":"한 줄 요약","file":"2026-10-제목.md"}
   ```
3. GitHub에 올리면 섬의 일기장 책상과 blog.html에 바로 나타납니다.
   (내 컴퓨터에서 파일로 열면 글 목록은 보이지 않아요. 웹에 올린 뒤 확인하세요.)
