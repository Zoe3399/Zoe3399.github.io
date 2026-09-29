# 2026-09-28 달리기 v2

기존 4프레임 달리기를 방향별 8단계로 교체했습니다. 정면/후면과 측면 아틀라스를 분리하고, 왼쪽은 측면 전체를 반전합니다. 발바닥을 기준으로 정렬하고 프레임 전체에 같은 축척을 적용하며, 두 체공 구간은 각각 주기의 6%로 제한합니다. 몸 전체의 회전/상하 흔들림을 중복 적용하지 않습니다. 실제 이동 거리 기반 보폭은 달리기에서 2.4단위입니다.

새 자산은 `seungju-hanbok-run-side-v2.png`, `seungju-hanbok-run-front-back-v2.png`이며 생성 프롬프트는 `ART-REVISION-PROMPTS.md`에 기록했습니다. 걷기, 한복/헤어스타일, 대기와 인사 동작은 유지합니다. 아래 내용은 이전 버전 기록입니다.

---

# 좌우 걷기와 Shift 달리기 보정

## 원인과 변경

사용자 녹화(14초)에서 확인한 좌우 보행은 발이 벌어진 자세가 반복되어 교차 과정이 약했습니다. 새 측면 걷기는 접지 → 몸 아래에서 두 발 교차 → 반대발 접지 → 반대쪽 교차 순서입니다. 사용자가 괜찮다고 한 위아래 걷기는 기존 프레임을 유지합니다.

Shift 달리기는 별도 4방향 4프레임 이미지입니다. 팔꿈치 굽힘, 뒷발 들기, 공중 자세, 작은 전방 기울기를 추가했습니다. 이미지별 키를 따로 맞춰 공중 자세의 발을 땅까지 늘리던 문제를 피하고, 방향별 동일 축척을 적용했습니다. 보행 주기는 실제 이동 거리와 보폭에 연결됩니다. Shift를 놓으면 가감속에 맞춰 걷기로 돌아옵니다.

4방향 이미지 애니메이션의 범위에서 개선한 것으로, 3D 관절 리깅/프레임 사이의 관절 보간은 아닙니다.

## 산출물

- 걷기: seungju-hanbok-walk-key.png (1254 × 1254)
- 달리기: seungju-hanbok-run-key.png (1254 × 1254)
- 원본 대기/한복 캐릭터와 인사/눈 깜빡임 이미지는 유지.
- 생성 방식: built-in image_gen, 기존 캐릭터 참조 편집. 외부 유료 API 사용 없음.

## 검증

실제 게임 입력으로 좌/우 걷기와 Shift 달리기를 재생하고, 확대된 네 단계 자세를 확인했습니다. 원본 콘텐츠 보존, 26개 이동 도착점, 대각선 방향, 충돌 시 걸음 중지, Shift 입력/해제에 따른 모드 전환, 인사 중 이동 우선순위, 움직임 줄이기 설정 테스트를 수행했습니다.

## 걷기 생성 프롬프트

Create a corrected WALK CYCLE sprite atlas for exactly the same hanbok woman in the reference. Identity, face, bob hairstyle, ivory jeogori, sage chima, cream shoes, matte 3D game style and camera must stay identical. This is animation production, not a collection of similar standing poses.

EXACT regular 4 columns x 4 rows, 16 separate full-body sprites on pure flat MAGENTA #FF00FF. Square canvas. NO grid lines, text, labels or shadows. Each cell has equal margins and same scale/head size, hips centered on same vertical line. Entire character visible.

DIRECTIONS: row1 FRONT; row2 BACK; row3 LEFT PROFILE nose left; row4 RIGHT PROFILE nose right.
Columns define the gait:
Column1 CONTACT A: left leg forward, right leg back, feet far apart along travel direction. Opposite arm forward.
Column2 PASSING A: right knee bends and swings FORWARD past left leg. The two SHOES MUST OVERLAP / be almost adjacent directly UNDER THE HIPS, one shoe visibly RAISED. Feet must NOT remain spread apart. Arms pass beside waist.
Column3 CONTACT B: right leg forward, left leg back, opposite of column1, feet apart again. Opposite arm forward.
Column4 PASSING B: left knee swings FORWARD past right leg. Two SHOES MUST AGAIN CROSS directly UNDER THE HIPS, one raised. Arms pass beside waist.

CRITICAL visual silhouette alternation: SPREAD FEET, FEET TOGETHER/CROSSING, SPREAD FEET WITH LEGS REVERSED, FEET TOGETHER/CROSSING. In profile passing frames columns2 and4, both shoes occupy the center beneath torso, never at opposite edges of skirt. The contact frames show one shoe at front hem edge and another at back hem edge. Show a small amount of lower leg beneath the hem so the bend/crossing is readable while retaining a long elegant chima. No trousers. No foot sliding pose. No duplicated contact poses in passing columns.
Head and torso should keep stable same height; very slight skirt sway, coherent lighting, no head reshaping. Deliberately articulate the legs and opposite arms. Natural walking not exaggerated running. All sixteen complete figures, generous empty gutters.

## 달리기 생성 프롬프트

Use case identity-preserve. Create a RUNNING animation sprite atlas of the EXACT supplied woman. Keep the same face, dark-brown side-parted bob, ivory jeogori, sage bow, long sage chima, cream flat shoes, smooth matte 3D game texture, body proportions, lighting and slightly elevated camera. This is a RUN, visibly different from walking.

ONE square image: exactly 4 columns by 4 rows, 16 full-body frames, empty solid pure MAGENTA #FF00FF background and empty gutters. No shadows, labels, grid, text, scenery or effects. Same scale, stable head size across all cells.
Row1 FRONT view; Row2 BACK view; Row3 LEFT-facing profile; Row4 RIGHT-facing profile.
Running poses per row:
Column1 LEFT-FOOT SUPPORT: one foot contacts ground below hips, opposite leg bends back with heel lifted, elbows bent, torso leaning a little forward.
Column2 FLIGHT A: no foot contacts ground, right knee drives forward and up, left lower leg folds back, arms pump in opposition, skirt hem rises subtly with motion.
Column3 RIGHT-FOOT SUPPORT: reverse the legs and arms of column1, right foot contacts ground beneath hips, left heel kicks backward.
Column4 FLIGHT B: reverse column2, left knee forward and right heel backward, both feet airborne.
Running silhouette: elbows visibly bent, modest forward lean, knees flexed, rear heel lifted toward skirt, alternating ground contact and flight. Never four similar straight-legged standing poses. Show lower shins beneath hem so leg bends read; skirt stays below knees and covers thighs. No trousers, no floating straight-legged jumps. Head and body retain exact identity, no exaggerated distortion. Maintain one fixed ground baseline per row with support feet at it and flight feet slightly above it. All 16 characters completely within their cells.

