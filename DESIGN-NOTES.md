# 승주의 섬 디자인 수정 기록

## 참고한 실제 게임 화면

- Nintendo 공식 Animal Crossing: New Horizons 소개: https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Animal-Crossing-New-Horizons-1438623.html
- 실제 너굴폰 화면: https://cdn.mos.cms.futurecdn.net/D5J4tPebXJrSvpFMjXgM33.jpg
- 크림색 종이 UI, 청록색 선택 상태, 둥근 앱 아이콘, 부드러운 그림자, 나무 간판, 주민 중심의 섬 화면을 참고했습니다. 게임의 스크린샷이나 공식 캐릭터 이미지를 사이트 에셋으로 복사하지 않았습니다.

## 수정 사항

- 시작 화면: 여러 색의 글자 블록을 나무 간판과 사진 기반 주민 캐릭터로 교체했습니다. 입장 버튼과 목록 보기 링크를 분리했습니다.
- 게임: 잔디·길·광장·나무·텐트·표지판의 색감과 입체감을 정리했습니다. 시계, 현재 위치를 표시하는 미니맵, 하단 주요 메뉴를 추가했습니다.
- 메뉴: 9개 목적지를 너굴폰을 참고한 3×3 아이콘 메뉴로 구성했습니다. 메뉴를 누르면 이동과 동시에 내용을 엽니다.
- 상세창: 본문은 읽기 편한 글꼴과 줄 간격을 사용하고, 제목·메타 정보·문제/역할/결과물의 위계를 정리했습니다. 종이색 상세창은 OS 다크 모드에서도 읽을 수 있습니다.
- 모바일: 390px 화면에서 가로 넘침 없이 상세창을 읽도록 했습니다. 방향 패드와 A 버튼, 메뉴의 간격을 조절했습니다.
- 키보드: 팝업 안에서 Tab 포커스 순환, Esc 닫기, 포커스 복귀, 시작 화면 뒤 버튼 비활성화, 동작 감소 설정을 적용했습니다.
- 목록·일기장: 같은 색상과 여백 체계로 정리하고 목록에서 섬으로 돌아가는 링크를 추가했습니다.
- 새싹 밭 빠른 이동의 도착 지점이 울타리와 충돌하던 문제를 수정했습니다.

## 내용 보존 및 검증

- 원본 21개 `<template>` 전체를 수정 전 파일과 바이트 단위로 비교해 일치함을 확인했습니다. 경력·프로젝트 설명·성과 수치·자료 링크·원본 사진은 그대로입니다.
- 목록·일기장의 기존 본문 및 JavaScript를 보존했습니다.
- 121개 로컬 파일 참조가 실제 파일로 연결되는지 확인했습니다.
- 26개 이동 목적지의 도착 위치가 충돌하지 않고 상호작용 거리 안에 있는지 확인했습니다.
- 브라우저에서 시작, 안내 건너뛰기, 모든 섬 메뉴, 프로젝트 상세, 낮/밤, 일기 목록·본문, 키보드 포커스를 확인했습니다. 검사 중 JavaScript 콘솔 오류가 없었습니다.
- 모바일 프레임 390×844에서 시작 화면·게임 UI·프로필 상세를 확인했습니다. 프로필 상세창 가로 크기/내용 크기 모두 352px로 가로 넘침이 없습니다. 실제 휴대전화 하드웨어의 터치 검증은 별도입니다.
- 원본 백업: `../portfolio-backup-before-codex/`

## 실제 플레이 영상 참고 보완

참고: [호이 Hoy · 날도 더워지는데 그냥 집에서 동숲을 해야지](https://www.youtube.com/watch?v=LSntRj8UTSs). 전체 영상을 시청한 것은 아니며, 약 0:27의 인벤토리, 1:00대 해변 이동, 16:10의 상점 주변 장면을 브라우저에서 확인했습니다.

- 웹 화면에 맞춘 원근 지면과 낮은 시점, 하늘·수평선·거리별 크기 차이.
- 부드러운 가속·감속과 카메라 추적, 대각선 속도 보정, Shift 달리기.
- 네 방향 캐릭터의 다리 교차와 발 디딤, 작은 흙먼지, 정지 시 미세한 호흡.
- 원근에 맞춘 울타리, 풍성한 나무, 잔디와 모래 질감, 해안의 잔물결.
- 걷는 동안 시계와 안내도를 옅게 표시하고 정지하면 복구. 종이 창과 메뉴의 짧은 등장 동작.

실제 3D 게임 엔진이나 원본 게임 모델을 사용한 것은 아닙니다. 사진 기반 2D 캐릭터와 캔버스의 원근 표현으로 구현했습니다. 포트폴리오 본문은 보존했습니다.

검증: 세 화면 크기의 원근 좌표 왕복, 30/60/120fps 이동 편차, 대각선 속도, 달리기, 벽 충돌 및 정지 테스트 통과. 기존 21개 본문 템플릿과 목록·일기장 콘텐츠 보존 검사, 26개 이동 도착지 검사 통과.

## 주변 환경 디자인 보완

닌텐도 공식 페이지의 여름 나무와 Nookipedia의 목제 간이 창고·정원 벤치·가로등 이미지를 사용했습니다. 자세한 출처는 `assets/img/scenery/SOURCES.md`에 기록했습니다. 텐트의 옆면과 천 주름, 초록 지붕의 게시판, 목재 울타리와 안내판, 우편함, 책상, 영화 스크린은 Canvas 코드로 표현했습니다.

밭 흙은 지면에 투영하고 작물은 각각 깊이에 따라 배치했습니다. 잎·꽃잎·열매의 명암과 가로등 높이에 맞는 야간 조명을 보완했습니다. 캐릭터를 가리는 앞쪽 나무는 잠시 옅어져 이동 위치를 확인할 수 있습니다. 본문과 상호작용 위치는 유지했습니다. 유료 생성 서비스를 사용하지 않았습니다.

## 캐릭터 제작

### 보행 수정 (화면 녹화 피드백)

서 있는 이미지의 종아리만 흔들던 방식 대신, 원본 머리·얼굴과 관절식 재킷·팔·다리를 합성하도록 변경했습니다. 이동 거리에 맞춘 발 디딤/들기, 팔의 반대 방향 흔들림, 정지 시 중립 자세를 적용했습니다. 걷기 2.4칸/초, 달리기 4.2칸/초로 낮췄습니다. 생성 API나 유료 서비스를 추가 호출하지 않았습니다. 네 방향 확대 미리보기와 발 접지·정지·충돌 검사를 수행했습니다.

내장 ImageGen 도구를 사용했습니다. 프로필 사진의 검은색 가르마 단발, 얼굴 인상, 검은 재킷과 흰 상의를 반영한 동물의 숲풍 사람 주민입니다. 앞·뒤·왼쪽·오른쪽 네 방향이며, 실제 게임 엔진의 3D 모델은 아닙니다. 브라우저 캔버스에서 방향별 스프라이트와 이동 흔들림으로 표현합니다.

- 입력 사진: `assets/img/profile.jpg`
- 최종 원본: `assets/img/seungju-villager-green.png`
- 브라우저용 내장 이미지: `assets/js/villager-source.js`
- 적용 코드: `assets/js/island.js`

투명 배경 요청 결과에 체크무늬가 포함되어, 마지막 편집에서는 초록 단색 배경을 생성했습니다. 런타임에서 초록 배경을 투명 처리하며, 생성 원본은 보존했습니다. data URI 로딩으로 로컬 파일로 열 때의 캔버스 출처 제한도 피하도록 구성했습니다.

### 최초 생성 프롬프트

> Use case: stylized-concept. Create a production-ready transparent PNG game character sprite sheet for a personal Animal Crossing: New Horizons-inspired browser portfolio. Input image is the user's portrait, identity reference only. Translate this same adult woman into an authentic Animal Crossing HUMAN VILLAGER aesthetic: oversized round head, very small rounded body, simple large oval dark eyes, tiny triangular nose, small friendly closed smile, soft peach complexion, straight BLACK shoulder-length hair with the same slightly off-center part, forehead visible without bangs, tucked sides. Her outfit matches the portrait: charcoal-black blazer over a plain white top, charcoal trousers, small cream shoes. Soft high-quality 3D Nintendo-like toy materials and gentle ambient shading, very recognizable ACNH human villager proportions, no realistic human anatomy. Sheet layout: EXACTLY FOUR separate full-body views of this ONE same character in ONE horizontal row, evenly spaced in four equal-width cells. From LEFT TO RIGHT: front facing camera, back facing away, left profile facing left, right profile facing right. Same scale and same foot baseline in every cell. Each entire character fits inside its own cell with 12% padding. Neutral standing pose with arms gently down and slightly out; feet together. Camera slightly elevated like the Animal Crossing game world, orthographic. Transparent background with actual alpha channel, no opaque background, no floor, no cast ground shadows, no words, no labels, no borders, no extra objects, no other characters. Wide 3:1 canvas. This asset will be sliced into four equal-width cells by browser code; exact evenly centered cell placement is critical.

### 최종 배경 편집 프롬프트

> Replace the ENTIRE checkerboard background in this image with solid vivid GREEN (#00FF00). Every pixel outside the four character silhouettes must be pure green. No checkerboard anywhere. Keep all four full-body character views exactly identical, same layout, same dimensions, same colors and poses and clothing and hair. This is a green-screen game sprite sheet. The background must look like a totally flat vivid green screen, not transparent, not checkerboard, not white. No shadows on green. Change background only.

## 캐릭터 비율 복구 및 렌더링 정리 (2026-09-28)

직접 그린 몸·팔다리를 합성하던 방식을 제거하고 원본 전신 4방향 이미지를 사용합니다. 옆모습과 뒷모습의 옷·손·신발 비율을 보존합니다. 현재는 완성된 걷기 프레임이나 3D 관절 애니메이션이 아닌, 방향 전환과 작은 전신 흔들림입니다. 위의 관절 리그 설명은 이전 구현 기록이며 현재 적용되지 않습니다.

도구 창고 높이를 163→98로 줄이고 접지 그림자와 충돌 범위를 함께 조정했습니다. 게시판·스크린·안내판의 크기도 줄였습니다. 참고 영상 https://www.youtube.com/watch?v=LSntRj8UTSs 의 약 4:43~5:15 야외 장면에서 물체 대비 주민 크기, 내려다보는 시점과 통로 구성을 비교했습니다. 지면 기울기를 .68→.80으로 조정했습니다. 나무 원본과 본문은 유지했습니다.

성능: 시작 전과 비활성 탭에서 섬 렌더 생략, 최대 60회/초 렌더, 대화·모달 중 10회/초, 미니맵 배경 캐시 및 10회/초 갱신, 정적 물체 깊이 사전 정렬, 고해상도 화면의 캔버스 픽셀 약 320만 상한. 나무·꽃·작물·텐트·게시판·울타리·안내판은 최대 96개 이미지 캐시를 공유해서 매 프레임 목재 무늬·그라데이션·글자를 다시 그리지 않습니다. 화면 밖 물체 제외도 유지합니다. 신규 라이브러리·외부 생성 API·결제는 추가하지 않았습니다.

단일 1920×1080 테스트 화면에서 최근 600회 기준 JavaScript 그리기 평균 약 3.93ms, 95백분위 5.40ms를 확인했습니다. 테스트 브라우저의 실제 갱신은 약 50fps였으며 60fps 보장으로 해석하지 않습니다. 네 방향 전신 보존, 이동·충돌, 본문 21개 보존 및 목적지 26개 검사를 통과했습니다. 성능 계측 페이지는 최종 포트폴리오에서 제외하고 `tmp/portfolio/qa-performance.html`에 보관합니다.

## 안내도에서 읽기와 실제 이동 분리

안내도 카드에는 `data-guide`를 사용하고 `openPlace`로 내용만 엽니다. 안내도를 보고 있던 캐릭터 좌표·카메라·주변 상호작용 대상은 바뀌지 않습니다. 안내도에서 진입한 하위 화면에는 `← 섬 안내도로` 버튼을 표시하며, 상세 항목에서도 유지합니다. 복귀 시 안내도 스크롤과 선택 항목의 키보드 초점을 복구합니다. 닫기·Esc는 창을 닫고, 직접 이동이나 하단 바로가기로 연 화면은 기존 동작을 유지합니다.

검증: 안내도 8개 카드 왕복, 작업실→TripDoc 상세→안내도 복귀, 닫은 뒤 Space로 같은 안내도 재열기, 원문 보존 검사.
