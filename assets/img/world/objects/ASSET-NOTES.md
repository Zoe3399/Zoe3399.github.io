# 개별 아트 교체 · 다리와 강

2026-09-28. Built-in image_gen 사용 (별도 CLI/API 사용 없음).

## 사용 파일

- `apple-tree.png`: 1229×1280, 투명 RGBA 사과나무
- `broadleaf-tree.png`: 1229×1280, 투명 RGBA 일반 나무
- `stepping-stone.png`: 1586×992, 투명 RGBA 디딤돌
- `honey-wood.png`: 다리·울타리용 밝은 목재 재질
- `river-water.png`: 흐르는 파란 수면 재질

승인된 `../../title/hanok-game-original.png`를 질감과 색감 기준으로 사용했습니다. 원본 PNG는 유지하고 동일 이미지를 여러 월드 오브젝트에서 재사용합니다. 집·가구·작물의 기존 개별 아트와 한복 캐릭터를 유지했습니다. 집/가구 이미지에 새로 합성하는 표지판 글자는 브라우저에서 폰트 로드 후 줄바꿈과 실제 글자 폭으로 배치합니다.

다리의 아치·판재·둥근 난간 및 강의 수면·물가 흙층은 실제 공간 도형입니다. 수면 이미지 위에 천천히 흐르는 잔물결과 부드러운 다리 그림자를 따로 렌더링합니다. 기존 걷기·Shift 달리기·높이·충돌·26개 목적지 연결을 보존합니다. 전체 이미지를 게임 화면에 붙이는 방식이 아닙니다.

## 확인

- 실제 브라우저에서 마당, 다리, Shift로 반대편 도착, 밤 조명, 망원경 대화창과 390px 화면을 확인했습니다.
- 다리 높이 및 강·건물·작물 충돌, 26개 목적지 이동 검사 통과.
- 기존 포트폴리오 템플릿 21개와 목록/블로그 원문 보존 검사 통과.
- 표지판은 글자를 가로로 압축하지 않고 줄바꿈 및 글자 크기로 맞추며, 대화 중 조작 안내는 숨기고 하단 메뉴와 간격을 확보했습니다.

## 최종 사용 프롬프트

### 사과나무

Using the attached hanok garden illustration as a STYLE reference, create ONE isolated broadleaf apple tree game object in high resolution, NOT a whole scene or atlas. Match the reference's soft rounded sculpted layered leaves, warm ochre textured trunk with flared roots, soft ambient shading, yellow green top leaves and darker muted teal green undersides. The crown should be rounded, wide and irregularly layered like the trees in the reference, NOT cone-shaped, NOT a Christmas tree. Three red apples nestle naturally IN the leaf canopy. Camera is slightly elevated FRONT, parallel perspective, trunk vertical. No environment, ground patch, grass, flowers or cast ground shadow. Full tree centered with generous clear margins; no clipped leaves. Single premium detailed 3D game sprite, natural painterly matte materials, not realistic photography, not flat clipart. TRANSPARENT alpha background, no checkerboard, no text. Portrait or square high-resolution output, tree fills 85% of canvas. Preserve the visual quality and style of the reference, this sprite will be placed independently in a game.

### 일반 나무

Use case: precise-object-edit. Edit target: the supplied apple tree PNG. Remove ONLY all three red apples and their stems; fill those small regions with matching layered green leaves. Preserve exact tree outline, trunk, leaf structure, shading, colors, camera, dimensions and position. CRITICAL output genuinely transparent RGBA background with actual alpha=0 around the tree; do not draw a checkerboard, white background or any floor. A standalone game tree sprite.

### 디딤돌

Create ONE isolated high-resolution stepping stone sprite matching the stone path of the attached hanok garden reference. A broad low warm gray irregular smooth garden stepping stone, softly rounded bevelled edges, slight thickness visible along front edge, natural subtle pale stone mottling and a few broad mineral patches. Camera slightly elevated looking down, parallel front view: top surface is an oval irregular hexagon, width about 1.6 times its visible height, gently flattened perspective, as in the reference. This is a charming matte 3D life-sim garden object, NOT flat polygon clipart, NOT an angular rock, NOT photo-real. Top-left soft light with warm pale-gray top and subtly darker sides, no green tint. ONE stone only, centered, fills canvas with margins. Transparent alpha background; no grass, no path, no ground shadow, no scene, no checkerboard, no text. High quality, fine but restrained surface detail. The stone should feel heavy yet soft-edged, made from the exact same visual world as reference.

### 목재

Create only a seamless square ALBEDO material texture matching the honey-colored wood of the bridge and round fence posts in the attached hanok garden illustration. Warm light golden oak, soft broad painterly organic wood grain flowing VERTICALLY, a few gentle elongated knots, subtle diffuse variation, smooth matte surface with delicate believable wood fibers. Charming richly rendered cozy 3D game materials, not photo-real and not flat cartoon. Even light, no cast shadows, no highlights indicating a cylinder, no lighting gradients, no planks, no seams, no furniture, no objects, no bevelled border. Fill the entire image with the flat seamless material; matching opposite edges. Avoid dark orange, muddy brown, dense repeated straight lines, strong black streaks, high frequency noise. Bright warm golden-tan with cream golden grain like the bridge in the reference.

### 수면

Make a seamless square WATER SURFACE MATERIAL texture for the river in the attached cozy hanok game reference. Only flat top-down blue water filling canvas, no banks, bridge, objects or horizon. Match the reference's clear soft cornflower/cerulean blue river, subtle broad cloudlike underwater blue variations and a few faint soft painterly ripple streaks. No white sparkle objects: animated white glints will be added in code. Even diffuse albedo, bright charming matte 3D game palette, luminous medium blue with restrained darker blue patches, not turquoise/teal, not tropical transparent sea, not photo realistic, no strong waves or fine noisy ripples, no perspective, no light direction, no large gradients. Tileable on all four sides. The texture must be quiet and readable behind the character and bridge.
