# 캐릭터 질감 통일

Built-in image_gen 사용. 기존 얼굴·단발·아이보리 저고리·연두 치마를 유지하고 승인된 한옥 배경의 따뜻한 빛과 부드러운 입체 질감을 맞췄습니다. 원본 파일은 유지합니다.

## 사용 파일

- `standing.png`: 4방향 서 있는 자세. 시작 화면·프로필·게임의 공통 원본.
- `motion.png`: 20프레임 기본 걷기·눈 깜빡임·인사.
- `walk.png`: 16프레임 걷기, 발 교차 보존.
- `run-side.png`: 측면 8프레임 달리기, 왼쪽은 전체 반전.
- `run-front-back.png`: 정면 8프레임 + 후면 8프레임 달리기.

## 적용 및 확인 (2026-09-29)

4방향 정지 + 60개 동작 프레임에 동일한 재질 기준을 적용했습니다. 발바닥 위치와 실제 인물 높이로 정지 프레임의 크기를 맞추고, 지면/다리 위에 부드러운 접지 그림자를 표시합니다. 달리기의 짧은 체공 구간에는 그림자 농도가 살짝 낮아집니다. 얼굴과 한복 디자인, 기존 이동·충돌·보폭·달리기 타이밍은 유지했습니다.

이미지를 별도 PNG로 불러와 더 이상 사용하지 않는 구형 달리기 아틀라스와 중복 base64 스크립트 로드를 제거했습니다. 원본 파일은 삭제하지 않았습니다.

브라우저에서 정면/후면/측면 달리기, 좌우 걷기, 인사 프레임의 전후 비교 및 실제 마당·다리·밤 장면을 확인했습니다. 모든 아틀라스가 완전히 로드됩니다. 기존 동작/접지·8프레임 달리기 검사, 26개 목적지와 충돌 검사, 원문 21개 템플릿 및 목록/블로그 보존 검사를 통과했습니다.

`preview-title.jpg`는 수정된 실제 시작 화면 스크린샷입니다.

## 기본 캐릭터 프롬프트

Use case: identity-preserve / style-transfer. Image 1 is the EDIT TARGET: existing FOUR-VIEW character sprite sheet. Image 2 is STYLE REFERENCE ONLY, never put the character on the garden. Refine materials on EXACT SAME Korean woman: same recognizable face, eyes, little smile, side-parted brown bob haircut, unmarried woman's simple everyday hanbok (ivory jeogori, sage-green chima, small green ribbon, ivory shoes), exact body proportions. No bridal accessories, no new hairstyle or costume. Match the garden's soft sculpted hand-painted 3D game materials: subtle warm peach skin shading, soft chestnut hair highlights instead of sharp dark grooves, more readable softly rounded cloth folds and a slightly fresher botanical sage-green skirt (not gray, not fluorescent), restrained fine fabric texture, warm upper-left daylight with gentle cooler shaded folds. Clear at small gameplay size, no harsh outline or photorealism. Preserve luminous ivory and natural skin color, do NOT dim/desaturate everything. CRITICAL preserve all four exact standing poses and directions, in precisely four equal-width columns ONE ROW: FRONT, BACK, LEFT PROFILE, RIGHT PROFILE. Same orthographic camera, same head size and baseline, full bodies entirely visible with equal gutters. Output same wide 3:1 atlas arrangement. Background MUST remain solid flat pure MAGENTA #FF00FF (for runtime chroma key); no gradient, no shadow, no ground, no text, no grid. Change only rendered material/lighting finish, not identity, pose, composition or anatomy.

## motion

Precise material-only edit of an animation sprite atlas. Image 1 is the edit target, every pose is locked. Image 2 is the approved CHARACTER MATERIAL reference. Match Image 2's warm upper-left soft daylight, chestnut hair highlights and sculpted hair, subtle peach skin shading, luminous ivory fabric, slightly fresher botanical sage green skirt, softly rounded readable cloth folds. Keep EXACT original identity, face, bob hairstyle, garment, ribbon and shoes. Preserve every arm, leg, foot pose and facing direction, frame order, head scale and baseline, margin and empty gutter. This is a material edit, not a new animation or redesigned character. Consistent lighting across all frames. No new accessories, outlines, glossy plastic, dark grading, scenery or ground shadows. Background stays solid pure MAGENTA #FF00FF with no text or grid. Exactly 4 columns by 5 rows, 20 frames. First four rows front/back/left/right walking. Last row closed-eye idle, partial greeting, raised-hand greeting, closed-eye wave. Preserve every original expression and hand position. Portrait 4:5 canvas.

## walk

Precise material-only edit of an animation sprite atlas. Image 1 is the edit target, every pose is locked. Image 2 is the approved CHARACTER MATERIAL reference. Match Image 2's warm upper-left soft daylight, chestnut hair highlights and sculpted hair, subtle peach skin shading, luminous ivory fabric, slightly fresher botanical sage green skirt, softly rounded readable cloth folds. Keep EXACT original identity, face, bob hairstyle, garment, ribbon and shoes. Preserve every arm, leg, foot pose and facing direction, frame order, head scale and baseline, margin and empty gutter. This is a material edit, not a new animation or redesigned character. Consistent lighting across all frames. No new accessories, outlines, glossy plastic, dark grading, scenery or ground shadows. Background stays solid pure MAGENTA #FF00FF with no text or grid. Exactly 4 columns by 4 rows, 16 frames. Rows front/back/left/right. Preserve original alternation of feet-apart contacts and feet-crossing passing poses. Square canvas.

## run-side

Precise material-only edit of an animation sprite atlas. Image 1 is the edit target, every pose is locked. Image 2 is the approved CHARACTER MATERIAL reference. Match Image 2's warm upper-left soft daylight, chestnut hair highlights and sculpted hair, subtle peach skin shading, luminous ivory fabric, slightly fresher botanical sage green skirt, softly rounded readable cloth folds. Keep EXACT original identity, face, bob hairstyle, garment, ribbon and shoes. Preserve every arm, leg, foot pose and facing direction, frame order, head scale and baseline, margin and empty gutter. This is a material edit, not a new animation or redesigned character. Consistent lighting across all frames. No new accessories, outlines, glossy plastic, dark grading, scenery or ground shadows. Background stays solid pure MAGENTA #FF00FF with no text or grid. Exactly 4 columns by 2 rows, 8 RIGHT PROFILE running poses in original order. Preserve bent elbows, knees, rear heel, contact/passing/flight poses precisely. Wide 16:9 canvas.

## run-front-back

Precise material-only edit of an animation sprite atlas. Image 1 is the edit target, every pose is locked. Image 2 is the approved CHARACTER MATERIAL reference. Match Image 2's warm upper-left soft daylight, chestnut hair highlights and sculpted hair, subtle peach skin shading, luminous ivory fabric, slightly fresher botanical sage green skirt, softly rounded readable cloth folds. Keep EXACT original identity, face, bob hairstyle, garment, ribbon and shoes. Preserve every arm, leg, foot pose and facing direction, frame order, head scale and baseline, margin and empty gutter. This is a material edit, not a new animation or redesigned character. Consistent lighting across all frames. No new accessories, outlines, glossy plastic, dark grading, scenery or ground shadows. Background stays solid pure MAGENTA #FF00FF with no text or grid. Exactly 4 columns by 4 rows, 16 running poses. First TWO rows eight FRONT poses, last TWO rows eight BACK poses. Preserve alternating support legs and arms precisely. Wide 3:2 canvas.

