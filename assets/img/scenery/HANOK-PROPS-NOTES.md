> 아래는 이전 제작 기록입니다. 현재는 이 소품 아틀라스를 개별 오브젝트로 다시 사용합니다. 실제 지형과 이미지 오브젝트를 결합한 현재 구현은 `../world/WORLD-NOTES.md`를 참고하세요.

# 한옥 마당과 소품

승인한 한옥 배경(assets/img/title/hanok-game.webp)을 실제 탐색 화면으로 사용합니다. 전체 3D 엔진이 아니라 배경 이미지와 발 위치 기준으로 정렬하는 캐릭터/소품 스프라이트를 결합한 화면입니다.

## 리소스

- 생성 도구: built-in image_gen, reference-based generation. 외부 유료 API를 사용하지 않았습니다.
- 승인된 원본: assets/img/scenery/hanok-props-key.png (1254 × 1254, 3 × 3)
- file:// 호환 소스: assets/js/hanok-props-source.js
- 배경 제거 및 분리: assets/js/hanok-props.js (로드 시 한 번 처리)
- 배치/이동 범위/앞뒤 정렬: assets/js/island-courtyard.js
- 캐릭터: 기존 한복 4방향 이미지를 유지. 신발 끝을 분석해 방향별 발 기준점을 맞추고, 일정한 크기와 부드러운 접지 그림자를 적용.
- 참고: 사용자가 제공한 게임 이미지와 https://kr.pinterest.com/pin/385831893093215458/ (브라우저에서 확인). 링크의 생활 공간처럼 소품을 그룹화하는 배치를 참고했습니다.

## 검증

21개 원본 콘텐츠 템플릿, 목록/블로그 내용 보존. 로컬 참조 134개 확인. 이동 지점 26곳의 도착 위치, 물/집 영역 진입 방지, 데스크톱과 모바일 화면의 배경 채움/좌표 변환 확인. 1920 × 1080 브라우저 측정에서 평균 렌더 콜백 약 0.42ms, p95 0.60ms, 약 59fps (해당 로컬 측정값이며 기기별 결과는 다름).

## 생성 프롬프트

Asset type: coherent 3x3 game prop sprite atlas, one square image requested 2048x2048.
Reference 1 is the EXISTING HOUSE whose exact rendering style/materials to match. Reference 2 is current playable scene for scale/context ONLY: replace its flat props, do NOT copy their flat graphics.
Create EXACTLY NINE isolated game props in an evenly spaced 3-column by 3-row grid, one complete object per equal square cell, ample 12% magenta margins in every cell. Read left to right top to bottom:
1 TOP LEFT: small wide hanok storage shed, short warm honey-oak double doors, tiny dark iron handles, thick rounded timber beams, short gently curved charcoal blue-gray ceramic giwa tiled roof matching reference house, low gray stone plinth, small BLANK ivory plaque on lintel just below roof. Squat compact cute proportions, not an outhouse.
2 TOP CENTER: elegant tall charcoal-bronze lamp post, short arm extending LEFT suspending a square traditional Korean cream paper lantern in warm wood frame, softly curved tiny giwa cap, compact stone base. Entire pole visible. Lit softly pale ivory in daytime. No empty glass cage.
3 TOP RIGHT: outdoor wooden noticeboard on two thick short posts, curved charcoal giwa cap, three cream/pale-pink/pale-yellow paper notes pinned on warm cork. Only abstract faint lines on notes, NO lettering. Full legs visible.
4 MIDDLE LEFT: wooden wayfinding sign on two short posts, ONE large wide blank pale honey-colored rectangular wooden board with softly rounded edges, flat front unobstructed, blank area for two lines of text, no symbols or text. The face occupies the upper 55% of total height. A chunky simple frame.
5 MIDDLE CENTER: outdoor cinema screen: wide warm ivory blank fabric screen in rounded honey-oak frame on two short wooden legs. No movie, no icon, no letters.
6 MIDDLE RIGHT: low honey-oak writing table with open cream notebook, simple pencil and small celadon flower vase. Front legs visible, open book visible from the slightly elevated camera. No lettering.
7 BOTTOM LEFT: cute small wooden postbox on short warm timber post, subtly curved dark gray cap, narrow dark mail slot, small muted terracotta flag. Full post and stone foot visible.
8 BOTTOM CENTER: cozy low garden bench made of thick rounded honey-oak planks, simple low backrest and two solid short legs, front facing.
9 BOTTOM RIGHT: ONE short wooden fence panel, two round chunky posts with rounded caps and two horizontal timber rails, broad softly shaded honey-oak material matching house. Full object.
ALL props must have a coherent Animal Crossing New Horizons-like softly sculpted 3D game render, warm hand-painted matte materials, beveled round edges, smooth ambient shading and upper-left sunlight. Match the supplied hanok, not realistic photos, not vector drawings, not flat low-poly shapes, no hard black outlines. All face DIRECTLY forward with ONLY a slight elevated camera showing tops, symmetrical front view, no isometric/diagonal views. Same camera and lighting across all nine. Objects not overlapping. Each individual item centered within its own exact one-ninth cell.
BACKGROUND MUST BE SOLID PURE MAGENTA #FF00FF, including gaps between legs and rails. No ground, shadows cast on background, scenery, frames, grid lines, labels, numbers, titles, text, or watermarks. Do not render transparency checkerboard.

