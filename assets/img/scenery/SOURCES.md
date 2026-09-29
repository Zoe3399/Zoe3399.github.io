# Scenery image sources

Animal Crossing: New Horizons artwork and item renders: © Nintendo. These images are third-party game artwork, not newly authored portfolio illustrations. Retrieved 2026-09-28. The portfolio is an unofficial personal project.

| Local file | Source |
| --- | --- |
| `hardwood-summer.png` | [Nintendo official game page](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Animal-Crossing-New-Horizons-1438623.html), [original tree image](https://www.nintendo.com/eu/media/images/08_content_images/games_6/nintendo_switch_7/nswitch_animalcrossingnewhorizons/NSwitch_AnimalCrossingNewHorizons_Overview_World_tree_summer.png) |
| `wooden-storage.png` | [Nookipedia: Wooden storage shed](https://nookipedia.com/wiki/Item:Wooden_storage_shed_(New_Horizons)), [original image](https://dodo.ac/np/images/e/e8/Wooden_Storage_Shed_%28Brown%29_NH_Icon.png) |
| `garden-bench.png` | [Nookipedia: Garden bench](https://nookipedia.com/wiki/Item:Garden_bench_(New_Horizons)), [original image](https://dodo.ac/np/images/a/a6/Garden_Bench_%28Black%29_NH_Icon.png) |
| `streetlamp.png` | [Nookipedia: Streetlamp](https://nookipedia.com/wiki/Item:Streetlamp_(New_Horizons)), [original image](https://dodo.ac/np/images/2/27/Streetlamp_%28Green%29_NH_Icon.png) |

Files are retained unchanged. Canvas draws their transparent bounding rectangles at the island's perspective scale. `assets/js/scenery-source.js` embeds the same images as data URLs for local file compatibility. No remote asset requests or generation services are used by the portfolio.

Tent, bulletin board, mailbox, diary table, fences, signs, screen and plants are drawn by the local Canvas code in `assets/js/island-scenery.js`.

## Generated hanok replacement

`seungju-hanok.png` and `seungju-hanok.webp` are newly generated artwork made with built-in ImageGen for this portfolio, replacing the procedural tent. They are not third-party extracted game assets. See [HANOK-NOTES.md](HANOK-NOTES.md) for the full prompt and runtime details. The web page loads only the compressed WebP through the local embedded source.
