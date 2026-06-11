---
applyTo: "**/*.{vue,svelte}"
---

# GSAP in Vue / Nuxt / Svelte — path-specific instructions

**Vue / Nuxt:**
- Create tweens and ScrollTriggers inside `onMounted`. Save references on the component instance or in a `ref`.
- Revert / kill in `onUnmounted`: `tween.kill()`, `st.kill()`, `splitInstance.revert()`.
- Scope selectors to the component's root element. Capture the root with a `ref`, then `gsap.context(() => { ... }, rootRef.value)` for automatic cleanup of all selectors used inside.
- Nuxt: keep GSAP code in `<script setup>` with `onMounted` so it runs client-only, or wrap the consuming component in `<ClientOnly>`. Never call `gsap.to` at module scope (SSR will error).

**Svelte / SvelteKit:**
- Use `onMount(() => { ... return cleanup; })`. Svelte calls the returned function on destroy. Put `tween.kill()` / `st.kill()` / `splitInstance.revert()` in the cleanup.
- SvelteKit SSR: GSAP must not run at module scope. Use `onMount` exclusively.
- For reactive props that should re-trigger an animation, watch them with `$effect` (Svelte 5) or `afterUpdate` (Svelte 4) and re-create the tween, killing the previous instance first.
