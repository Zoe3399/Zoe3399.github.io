# 한복 캐릭터 동작

## 적용 내용

- 기존 단발머리, 얼굴, 크림색 저고리와 연두색 치마 유지.
- 단일 정지 그림을 흔들던 이동에서 방향별 4개 보행 자세로 변경.
- 자세 선택은 실제 이동 거리에 연결되므로 벽에 막히면 걸음이 멈추며 달릴 때 재생도 빨라짐.
- 대각선 입력에서 이전의 반대 방향을 유지하던 오류 수정.
- 발을 기준으로 작은 숨쉬기, 정면 눈 깜빡임, 쉬고 있을 때 간헐적 인사 추가.
- 게임에서 E 또는 캐릭터 클릭으로 인사. 시작 화면은 캐릭터 클릭/키보드 활성화로 인사.
- 이동하면 인사는 즉시 중단. 움직임 줄이기 설정 지원.
- 한복/얼굴을 부분적으로 잘라 변형하지 않고 완성된 자세 이미지를 사용.

## 방식과 제한

4방향 스프라이트 애니메이션이며 실시간 3D 리깅은 아닙니다. 한 방향마다 4프레임이라 원작의 연속적인 관절 움직임이나 자유로운 회전을 모두 재현하지는 않습니다. 원본 캐릭터 이미지는 대기 자세와 로드 실패 시 대체 표시로 유지합니다. 생성된 마지막 인사 프레임은 드는 손이 달라 연속 인사에 사용하지 않았습니다.

## 참고 및 검증

사용자 영상 https://www.youtube.com/watch?v=LSntRj8UTSs 의 8–9분대 주변 이동/도구 사용 장면을 브라우저에서 확인했습니다. 전체 2시간 41분을 시청한 것은 아닙니다.

브라우저에서 시작 화면 인사, 마당 보행/정지, E 인사 확인. 실행 경고/오류 없음. 방향별 프레임 선택, 인사 시간, 이동 우선순위, 대각선 방향, 충돌 시 보행 중지, 움직임 줄이기 테스트 통과. 기존 21개 콘텐츠 템플릿과 목록/블로그 내용 보존 검증 통과.

## 저장 파일 / 생성 방식

- 원본 생성 이미지: seungju-hanbok-motion-key.png (1122 × 1402, 4열 × 5행)
- 내장 소스: ../js/hanbok-motion-source.js
- 로더 및 자세 선택: ../js/hanbok-animation.js
- 생성: built-in image_gen, 기존 로컬 캐릭터 이미지 참조 편집. 외부 유료 API 호출 없음.
- 런타임에서 마젠타 제거 및 실제 행/열 여백 감지 후 한 번 분리. 원본 파일 보존.

## 최종 생성 프롬프트

Use case: identity-preserve, game animation sprite atlas.
EDIT / expand the supplied reference character into an animation sheet. Preserve EXACT character identity: same face, bob haircut silhouette and side part, large brown eyes, small triangular nose, cream jeogori with sage bow, sage green long chima skirt, cream shoes, proportions and slightly elevated camera. Smooth matte sculpted game materials, broad soft highlights in hair, no realistic hair strands or noisy cloth weave. Same upper left daylight.

Output ONE exact regular 4 COLUMNS by 5 ROWS sprite sheet, all 20 full-body figures separately centered with generous empty margins. Canvas portrait 4:5, ideally 2048x2560. Every cell SAME dimensions and SAME character scale, same head size, same stable pelvis position and ground baseline near 88% cell height. No labels or grid.
Rows 1-4 are four successive walking cycle poses, with naturally alternating arms, feet exposed just beneath skirt, gently swaying skirt. Modest steps, NO running leaps. Torso upright, head same shape and scale across all poses.
ROW 1: four FRONT-facing walking frames: left foot forward; passing pose; right foot forward; passing opposite.
ROW 2: four BACK-facing walking frames, matching that sequence. Back of head only, no face.
ROW 3: four LEFT-facing profile walking frames (nose points image-left), matching sequence.
ROW 4: four RIGHT-facing profile walking frames (nose points image-right), matching sequence.
ROW 5 all FRONT-facing, feet side by side stationary on same baseline:
cell1 relaxed normal standing with eyes gently CLOSED (blink);
cell2 beginning friendly greeting, right forearm halfway raised;
cell3 friendly wave with right hand raised next to head, open eyes and soft smile;
cell4 friendly wave hand slightly tilted outward, soft closed-eye happy smile.
Preserve limb anatomy, same long skirt length throughout. Do not add jewelry, ceremonial accessories, head ornaments, hats, new clothes, items or background scenery.
Background genuinely transparent alpha, no checkerboard pattern or shadows. If actual transparency cannot be rendered use perfectly flat PURE MAGENTA #FF00FF in all empty pixels including limb gaps, no floor and no cast shadow. No text, no watermark. Exactly 20 complete sprites, four columns five rows.

