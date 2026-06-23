# Resolution Presets & Output Formats

Pass presets with `node render.mjs --preset <name>` and formats with `--format <name>`.

## Presets (`--preset`)

| Preset | CSS viewport | deviceScaleFactor | Output | Aspect | Use |
|---|---|---|---|---|---|
| `1080p` (default) | 1920×1080 | 1 | 1920×1080 | 16:9 | standard landscape |
| `4k` | 1920×1080 | 2 | 3840×2160 | 16:9 | high-res landscape (no reflow — CSS viewport stays 1080p) |
| `vertical` | 1080×1920 | 1 | 1080×1920 | 9:16 | reels / stories / shorts |
| `square` | 1080×1080 | 1 | 1080×1080 | 1:1 | feed posts |

To add a custom preset, edit the `PRESETS` table at the top of `render.mjs`.

## Formats (`--format`)

| Format | Codec | Alpha | Use |
|---|---|---|---|
| `mp4` (default) | H.264 `yuv420p` crf 18 | no | quick preview / share |
| `webm` | VP9 `yuva420p` | **yes** | transparent web `<video>` overlay |
| `mov` | ProRes 4444 `yuva444p10le` | **yes** | After Effects / Premiere / FCPX handoff |

Add `--transparent` to remove every background and keep alpha (forces `perspective: none` +
`transform-style: flat`, so `rotationY` / `rotationX` cannot be captured in this mode — see
gsap-plugins §"3D compositing artifact"). Pair `--transparent` with `webm` or `mov`, not `mp4`.

## Dev preview at a target aspect

Append `?ar=9/16` (or `1/1`, `4/3`…) to `index.html` in the browser to frame the stage at that
ratio before rendering. At render time the Puppeteer viewport IS the target aspect, so the stage
fills the frame exactly.

## Example commands

```bash
npm install                                  # first time only
node render.mjs --preset 1080p               # landscape mp4
node render.mjs --preset vertical            # 9:16 reel
node render.mjs --preset 4k                  # 4K landscape
node render.mjs --preset square --format webm --transparent   # transparent square overlay
```
