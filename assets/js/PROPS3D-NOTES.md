# World-space props (2026-09-28)

The storage shed and six lanterns use small vertex/face meshes in island-props3d.js. They are projected through the existing IslandMotion ground camera and painted on the existing Canvas 2D context. This is a hybrid scene, not a complete WebGL conversion: trees, the house and the character still use their existing artwork.

- Shed: wide double wooden doors, muted roof, stone footing, attached readable plaque.
- Lantern: dark metal post, short arm and warm square paper lantern.
- Geometry is created once; projected faces are reused while the camera stays unchanged. Off-screen culling, the frame cap and the canvas pixel budget remain in place.
- All assets are local. No generation service, model download, external engine or paid API is required.
- The shed collision box follows its new 106 × 48 world-unit footing. Its arrival point remains outside the box. Night lighting follows the hanging lantern at x − 20, z 86.

Validation: original 21 content templates preserved; local links and 26 arrival points checked; movement/camera checks passed. Browser inspection covered front/left/right views and night lighting. Performance figures are recorded in the task reply; they describe the test environment, not a universal frame-rate guarantee.

Performance check, same 1920 × 1080 embedded browser, night mode, one active scene:
- Prior sprites: sampled mean 3.88 ms, p95 5.30 ms, observed rendered cadence 54.6 fps.
- Initial meshes: mean 4.65 ms, p95 6.40 ms, observed cadence 47.9 fps.
- Cached paths: idle sample mean 4.48 ms, p95 6.00 ms, observed cadence 47.3 fps.
These are sequential samples, affected by browser scheduling. The meshes add some CPU work; this does not establish 60 fps or performance on all devices. The 3.2-million-pixel budget and offscreen culling remain active.
Final cached-path sample after the movement tour: mean 4.30 ms, p95 6.00 ms, observed cadence 48.1 fps.
