---
applyTo: "**/*.{js,jsx,ts,tsx,mjs,vue,svelte,astro}"
---

# gsap.utils — path-specific instructions

When you need numeric mapping, array utilities, randomness, or function composition, prefer `gsap.utils` helpers over hand-rolled equivalents:

- `gsap.utils.clamp(min, max, value)` — clamp into range. Pass without `value` to get a curried function.
- `gsap.utils.mapRange(inMin, inMax, outMin, outMax, value)` — remap one numeric range to another.
- `gsap.utils.interpolate(start, end, t)` — works on numbers, colors (hex / rgb), arrays, objects.
- `gsap.utils.random(min, max, [increment], [returnFunction])` — uniform random; pass `true` as 4th arg to return a function (perfect for stagger property values: `x: gsap.utils.random(-50, 50, true)`).
- `gsap.utils.snap(increment, value)` — snap to grid; or `snap([1, 2, 5, 10], value)` to snap to nearest in a list.
- `gsap.utils.toArray(target)` — universal array coercion (selector string / NodeList / array / single element). Use this whenever you accept "any" target.
- `gsap.utils.wrap([a, b, c])` — cyclic wrap, perfect for distributing values across a stagger.
- `gsap.utils.pipe(fn1, fn2, fn3)` — left-to-right function composition.
- `gsap.utils.distribute({ base, amount, from: "center" })` — spatial distribution for stagger.
