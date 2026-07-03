/**
 * Notion Launch — 36s product demo video (8 shots, MORPH TRANSITIONS)
 *
 * Design Read: product demo video for productivity-tool audience,
 * with a clean-functional language matching notion.com exactly.
 * Leaning toward Inter + Notion brand palette and CINEMATIC motion mode.
 *
 * Three Dials: MOTION_INTENSITY=8 / DESIGN_VARIANCE=7 / VISUAL_DENSITY=6
 * Motion mode: Cinematic → seamless invisible cuts, continuous camera inertia,
 *              match-cut action continuity, timeline overlap transitions
 *
 * TRANSITION PHILOSOPHY:
 *   - No hard cuts. Every shot transition uses a 0.5-0.8s overlap window.
 *   - Camera state is inherited shot-to-shot (scale/rotation/position carry-over).
 *   - Exit action of shot N matches entrance action of shot N+1 (match cut).
 *   - Elements from both shots coexist during the overlap, creating "invisible cut".
 *   - MORPH TRANSITION: UI components transform geometrically between shots.
 *     Components split, merge, stretch, or reconfigure to bridge scenes visually.
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
import SplitText from "https://esm.sh/gsap@3.15.0/SplitText";

gsap.registerPlugin(SplitText);

const camera = ".camera";

const mm = gsap.matchMedia();

mm.add(
  {
    isMotionOK: "(prefers-reduced-motion: no-preference)",
    isReduced:  "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { isMotionOK } = ctx.conditions;

    if (!isMotionOK) {
      gsap.set(".shot-8", { autoAlpha: 1 });
      gsap.set([".shot-1",".shot-2",".shot-3",".shot-4",".shot-5",".shot-6",".shot-7"], { autoAlpha: 0 });
      gsap.set(camera, { scale: 1, xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, rotationY: 0, z: 0 });
      window.__studio = { gsap, tl: gsap.timeline(), duration: () => 0 };
      window.dispatchEvent(new Event("__studio:ready"));
      return;
    }

    document.fonts.ready.then(() => {
      // SplitText for shot-8 CTA headline
      const ctaSplit = SplitText.create(".shot-8 .cta-headline", {
        type: "lines",
        mask: "lines",
        linesClass: "cta-line"
      });

      // ============================================================
      // MASTER TIMELINE — Seamless invisible cuts, continuous camera
      // ============================================================
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // ============================================================
      // INITIAL STATE — 3D perspective on camera for all shots
      // All shots start visible (autoAlpha:1) so they can coexist during overlaps
      // We use z-index / opacity to control visibility instead of autoAlpha
      // ============================================================
      tl.set(camera, {
        scale: 1, xPercent: 0, yPercent: 0,
        rotation: 0, rotationX: 0, rotationY: 0, z: 0,
        transformPerspective: 1400
      })
        // All shots start at opacity:0, but NOT visibility:hidden (so transforms compute)
        .set(".shot-1", { opacity: 1, zIndex: 10 })
        .set(".shot-2", { opacity: 0, zIndex: 20 })
        .set(".shot-3", { opacity: 0, zIndex: 30 })
        .set(".shot-4", { opacity: 0, zIndex: 40 })
        .set(".shot-5", { opacity: 0, zIndex: 50 })
        .set(".shot-6", { opacity: 0, zIndex: 60 })
        .set(".shot-7", { opacity: 0, zIndex: 70 })
        .set(".shot-8", { opacity: 0, zIndex: 80 });

      // ============================================================
      // SHOT 1: Hook — Full Notion app window (0-4.5s)
      // Camera enters: NEUTRAL (scale:1, all zero)
      // Camera exits: PUSH-IN peak (scale:1.12, rotationY:-4, yPercent:-3)
      // Transition to Shot 2: The app-window's topbar dots SPLIT and SCATTER
      //   into Shot 2's tab-chips. The sidebar items drift outward and fade.
      // MORPH: app-window border-radius increases, sidebar items become tab-chips
      // ============================================================
      tl.addLabel("shot1", 0);

      // App window materializes from deep z-space
      tl.from(".shot-1 .app-window", {
        opacity: 0, scale: 0.82, rotationX: 18, z: -120,
        duration: 1.4, ease: "expo.out"
      }, "shot1")
        .from(".shot-1 .app-dot", {
          opacity: 0, scale: 0, rotationZ: 45,
          stagger: 0.08, duration: 0.4, ease: "back.out(1.4)"
        }, "shot1+=0.3")
        .from(".shot-1 .app-title", { opacity: 0, duration: 0.4 }, "shot1+=0.5")
        .from(".shot-1 .sidebar-item", {
          opacity: 0, x: -60, rotationZ: -6, z: 40,
          stagger: 0.06, duration: 0.7, ease: "expo.out"
        }, "shot1+=0.4")
        .from(".shot-1 .page-title", {
          opacity: 0, y: 30, rotationX: 8,
          duration: 0.8, ease: "expo.out"
        }, "shot1+=0.8")
        .from(".shot-1 .page-block", {
          opacity: 0, y: 16, rotationX: 4,
          stagger: 0.04, duration: 0.5, ease: "power3.out"
        }, "shot1+=1.0")
        // CAMERA ORBIT PUSH-IN: scale 1.0 → 1.12 + rotationY -4° + yPercent -3
        .to(camera, {
          scale: 1.12, rotationY: -4, yPercent: -3,
          duration: 2.0, ease: "expo.inOut"
        }, "shot1+=0.5")
        // Parallax depth layers
        .to(".shot-1 .app-sidebar", { x: -14, y: -6, duration: 2.0, ease: "expo.inOut" }, "shot1+=0.5")
        .to(".shot-1 .app-page", { x: 8, y: 3, duration: 2.0, ease: "expo.inOut" }, "shot1+=0.5")
        .to(".shot-1 .app-window", { y: 4, rotationX: -2, duration: 2.0, ease: "expo.inOut" }, "shot1+=0.5")
        .from(".shot-1 .ai-cursor", { opacity: 0, duration: 0.3 }, "shot1+=2.4")
        // MORPH TRANSITION 1→2: app-window starts to deform at 3.2s
        // The window border-radius increases (becoming more like tab-chips)
        // Sidebar items drift outward, foreshadowing the tab scatter
        .to(".shot-1 .app-window", {
          scaleX: 1.15, scaleY: 0.85, borderRadius: "24px",
          duration: 0.8, ease: "power2.inOut"
        }, "shot1+=3.2")
        .to(".shot-1 .sidebar-item", {
          x: 80, y: -40, scale: 0.8, rotationZ: 12,
          stagger: 0.03, duration: 0.6, ease: "power2.in"
        }, "shot1+=3.2")
        .to(".shot-1 .app-topbar", {
          y: -20, scale: 0.9, opacity: 0.3,
          duration: 0.6, ease: "power2.in"
        }, "shot1+=3.2")
        // Shot 1 EXIT: fade out begins at 3.7s
        .to(".shot-1", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot1+=3.7");

      // ============================================================
      // SHOT 2: Pain — Tab overload (3.7-8.0s)
      // Camera enters: INHERITED from Shot 1 exit (scale:1.12, rotationY:-4, yPercent:-3)
      //   → continues pushing IN but with sudden CHAOS tilt (match cut: push becomes chaotic pull)
      // Camera exits: DRAMATIC PUSH to MCU (scale:1.22, rotationY:0, yPercent:0)
      // Transition to Shot 3: The scattered tabs CONVERGE toward center and MERGE
      //   into the reveal-bg card. The headline text dissolves into the logo space.
      // MORPH: tabs scale down and cluster, forming the reveal-bg card outline
      // ============================================================
      tl.addLabel("shot2", 3.7);
      // Shot 2 becomes visible at 3.7s while shot 1 is still fading out
      tl.set(".shot-2", { opacity: 1 }, "shot2")
        // CONTINUOUS ACTION: Camera was pushing in (scale:1.12), now it ACCELERATES into chaos
        .to(camera, {
          scale: 0.92, rotationY: 3, rotationZ: 2, yPercent: 5,
          duration: 0.5, ease: "power4.inOut"
        }, "shot2")
        // Tabs arc-scatter in from edges — chaotic stagger
        .from(".shot-2 .tab-chip", {
          opacity: 0, y: 60, scale: 0.75, rotationZ: "random(-12, 12)",
          stagger: { each: 0.03, from: "random" },
          duration: 0.55, ease: "expo.out"
        }, "shot2+=0.1")
        // Handheld shake on tabs bar
        .to(".shot-2 .tabs-bar", {
          x: 6, rotationZ: 1.5, duration: 0.08, yoyo: true, repeat: 5, ease: "sine.inOut"
        }, "shot2+=0.6")
        // Headline fades up from depth
        .from(".shot-2 .pain-headline", {
          opacity: 0, y: 30, scale: 0.95, rotationX: 6,
          duration: 0.9, ease: "expo.out"
        }, "shot2+=0.7")
        .from(".shot-2 .pain-body", {
          opacity: 0, y: 16, duration: 0.5, ease: "power3.out"
        }, "shot2+=1.1")
        // DRAMATIC PUSH to MCU — emphasis punch
        .to(camera, {
          scale: 1.22, rotationY: 0, rotationZ: 0, yPercent: 0,
          duration: 1.0, ease: "power3.inOut"
        }, "shot2+=1.8")
        // MORPH TRANSITION 2→3: tabs begin converging at 6.8s
        // They drift toward center, scale down, and rotate to align with reveal-bg
        .to(".shot-2 .tab-chip", {
          x: (i) => (i - 3.5) * -15, y: 30, scale: 0.6, rotationZ: 0,
          stagger: 0.02, duration: 0.6, ease: "power2.in"
        }, "shot2+=3.1")
        .to(".shot-2 .tabs-bar", {
          scale: 0.8, y: -20, opacity: 0.2,
          duration: 0.6, ease: "power2.in"
        }, "shot2+=3.1")
        .to(".shot-2 .pain-headline", {
          scale: 1.1, y: -10, opacity: 0.3,
          duration: 0.6, ease: "power2.in"
        }, "shot2+=3.1")
        // Shot 2 EXIT: fade begins at 7.2s
        .to(".shot-2", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot2+=3.5");

      // ============================================================
      // SHOT 3: Reveal — Meet Notion AI (7.2-12.0s)
      // Camera enters: INHERITED from Shot 2 exit (scale:1.22, rotationY:0, yPercent:0)
      //   → the extreme close-up "pulls back" and reveals the logo space behind it
      // Camera exits: SLOW PUSH toward logo (scale:1.06, rotationY:3)
      // Transition to Shot 4: The reveal-bg card STRETCHES horizontally and morphs
      //   into the editor-window. The logo scales down and becomes the editor's title icon.
      // MORPH: reveal-bg scaleX increases, scaleY decreases → editor-window proportions
      // ============================================================
      tl.addLabel("shot3", 7.2);
      tl.set(".shot-3", { opacity: 1 }, "shot3")
        // CONTINUOUS ACTION: Camera was at scale:1.22 (extreme close-up).
        // It pulls BACK to reveal the space.
        .to(camera, {
          scale: 1.0, rotationY: 0, rotationZ: 0, yPercent: 0, z: 0,
          duration: 0.8, ease: "power3.inOut"
        }, "shot3")
        // Background card converges from deep z
        .from(".shot-3 .reveal-bg", {
          opacity: 0, scale: 0.8, z: -100, rotationX: 12,
          duration: 1.2, ease: "expo.out"
        }, "shot3+=0.1")
        // Logo 3D flip from deep z — card flip reveal
        .from(".shot-3 .notion-logo-mark", {
          opacity: 0, scale: 0.5, z: -200, rotationY: -90,
          duration: 1.2, ease: "expo.out"
        }, "shot3+=0.3")
        .from(".shot-3 .reveal-headline", {
          opacity: 0, y: 40, z: 60, rotationX: 10,
          duration: 0.9, ease: "expo.out"
        }, "shot3+=0.6")
        .from(".shot-3 .reveal-body", {
          opacity: 0, y: 20, z: 40, rotationX: 6,
          duration: 0.7, ease: "power3.out"
        }, "shot3+=1.0")
        .from(".shot-3 .reveal-cta", {
          opacity: 0, y: 14, scale: 0.9, z: 30,
          duration: 0.5, ease: "back.out(1.2)"
        }, "shot3+=1.3")
        // Parallax: background drifts up
        .to(".shot-3 .reveal-bg", {
          y: -16, rotationX: -3, duration: 2.2, ease: "none"
        }, "shot3+=0.5")
        // Camera slowly pushes toward logo with slight orbit
        .to(camera, {
          scale: 1.06, rotationY: 3,
          duration: 1.8, ease: "power2.inOut"
        }, "shot3+=1.0")
        .to(".shot-3 .reveal-content", {
          x: -6, y: 4, duration: 1.8, ease: "power2.inOut"
        }, "shot3+=1.0")
        // MORPH TRANSITION 3→4: reveal-bg stretches horizontally at 10.7s
        // Card proportions morph from square-ish to wide editor-window shape
        .to(".shot-3 .reveal-bg", {
          scaleX: 1.3, scaleY: 0.85, borderRadius: "12px",
          y: 20, opacity: 0.4,
          duration: 0.7, ease: "power2.in"
        }, "shot3+=3.5")
        .to(".shot-3 .notion-logo-mark", {
          scale: 0.4, y: -30, rotationY: 15, opacity: 0.3,
          duration: 0.7, ease: "power2.in"
        }, "shot3+=3.5")
        .to(".shot-3 .reveal-headline", {
          y: -20, scale: 0.9, opacity: 0.2,
          duration: 0.7, ease: "power2.in"
        }, "shot3+=3.5")
        // Shot 3 EXIT: fade begins at 11.2s
        .to(".shot-3", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot3+=4.0");

      // ============================================================
      // SHOT 4: Feature — AI writing in editor (11.2-16.0s)
      // Camera enters: INHERITED from Shot 3 exit (scale:1.06, rotationY:3)
      //   → the push toward logo CONTINUES and morphs into orbit around editor
      // Camera exits: ORBIT + PUSH peak (scale:1.16, rotationY:4, yPercent:-2)
      // Transition to Shot 5: Camera is deep in the editor, it pushes THROUGH
      //   the editor surface into the database below (z-axis tunnel)
      // MORPH: editor-toolbar buttons fall down and reassemble as db-table headers
      // ============================================================
      tl.addLabel("shot4", 11.2);
      tl.set(".shot-4", { opacity: 1 }, "shot4")
        // CONTINUOUS ACTION: Camera was pushing toward logo (scale:1.06, rotationY:3).
        .to(camera, {
          scale: 1.16, rotationY: 4, yPercent: -2,
          duration: 1.0, ease: "expo.inOut"
        }, "shot4")
        // Editor window materializes from z-depth
        .from(".shot-4 .editor-window", {
          opacity: 0, y: 60, z: -80, rotationX: 10,
          duration: 0.9, ease: "expo.out"
        }, "shot4+=0.2")
        // Toolbar buttons arc in from top
        .from(".shot-4 .toolbar-btn", {
          opacity: 0, y: -20, rotationZ: "random(-4, 4)", z: 30,
          stagger: 0.04, duration: 0.45, ease: "power3.out"
        }, "shot4+=0.4")
        .from(".shot-4 .editor-h1", {
          opacity: 0, y: 18, rotationX: 5,
          duration: 0.7, ease: "expo.out"
        }, "shot4+=0.7")
        .from(".shot-4 .editor-line", {
          opacity: 0, y: 12, rotationX: 3,
          stagger: 0.05, duration: 0.45, ease: "power3.out"
        }, "shot4+=0.9")
        // AI suggestion pops from z-depth
        .from(".shot-4 .ai-suggestion", {
          opacity: 0, scale: 0.85, z: 50, rotationX: 8,
          duration: 0.6, ease: "back.out(1.2)"
        }, "shot4+=2.0")
        // Parallax: toolbar drifts opposite
        .to(".shot-4 .editor-toolbar", {
          x: -8, y: -4, duration: 1.6, ease: "power2.out"
        }, "shot4+=1.0")
        .to(".shot-4 .editor-canvas", {
          x: 4, duration: 1.6, ease: "power2.out"
        }, "shot4+=1.0")
        // MORPH TRANSITION 4→5: toolbar buttons fall and reassemble at 14.7s
        // Buttons drift downward, foreshadowing the db-table headers
        .to(".shot-4 .toolbar-btn", {
          y: 40, scale: 0.7, rotationZ: 0, opacity: 0.3,
          stagger: 0.02, duration: 0.6, ease: "power2.in"
        }, "shot4+=3.5")
        .to(".shot-4 .editor-window", {
          scaleY: 1.15, scaleX: 0.95, y: 30, opacity: 0.4,
          duration: 0.7, ease: "power2.in"
        }, "shot4+=3.5")
        .to(".shot-4 .editor-canvas", {
          y: 20, opacity: 0.2,
          duration: 0.6, ease: "power2.in"
        }, "shot4+=3.5")
        // Shot 4 EXIT: fade begins at 15.2s
        .to(".shot-4", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot4+=4.0");

      // ============================================================
      // SHOT 5: Feature — Database with AI auto-fill (15.2-20.0s)
      // Camera enters: INHERITED from Shot 4 exit (scale:1.16, rotationY:4, yPercent:-2)
      //   → the orbit push CONTINUES and transforms into z-axis tunnel through rows
      // Camera exits: DEEP Z-PUSH (scale:1.28, rotationX:-2, xPercent:2)
      // Transition to Shot 6: Camera is deep in the database, it pulls UP
      //   and the search window drops from above (crane up + drop match)
      // MORPH: db-table rows compress upward, becoming search-result list items
      // ============================================================
      tl.addLabel("shot5", 15.2);
      tl.set(".shot-5", { opacity: 1 }, "shot5")
        // CONTINUOUS ACTION: Camera was orbiting editor (scale:1.16, rotationY:4).
        .to(camera, {
          scale: 1.28, rotationX: -2, xPercent: 2, rotationY: 0,
          duration: 0.9, ease: "power3.inOut"
        }, "shot5")
        // Database window emerges from z-depth
        .from(".shot-5 .db-window", {
          opacity: 0, y: 40, z: -60, rotationX: 8,
          duration: 0.8, ease: "expo.out"
        }, "shot5+=0.2")
        .from(".shot-5 .db-toolbar", { opacity: 0, z: 20, duration: 0.4 }, "shot5+=0.4")
        .from(".shot-5 .db-view-tab", {
          opacity: 0, y: 8, rotationZ: "random(-2, 2)",
          stagger: 0.04, duration: 0.35, ease: "power3.out"
        }, "shot5+=0.5")
        .from(".shot-5 .db-table th", { opacity: 0, z: 10, duration: 0.4 }, "shot5+=0.7")
        // Rows tunnel in from z-depth
        .from(".shot-5 .db-table tbody tr", {
          opacity: 0, y: 25, z: -40, rotationX: 6,
          stagger: 0.12, duration: 0.7, ease: "expo.out"
        }, "shot5+=0.8")
        // Tags arc in
        .from(".shot-5 .db-tag", {
          opacity: 0, scale: 0.8, rotationZ: 6, z: 20,
          stagger: 0.05, duration: 0.35, ease: "back.out(1.2)"
        }, "shot5+=1.4")
        // AI badge from deep z
        .from(".shot-5 .db-ai-pill", {
          opacity: 0, scale: 0.6, z: -60, rotationY: 20,
          duration: 0.5, ease: "back.out(1.5)"
        }, "shot5+=1.8")
        // Pulse on AI badge
        .to(".shot-5 .db-ai-pill", {
          scale: 1.1, duration: 0.3, yoyo: true, repeat: 3, repeatDelay: 0.2, ease: "sine.inOut"
        }, "shot5+=2.3")
        // Parallax
        .to(".shot-5 .db-toolbar", {
          y: -5, rotationX: -2, duration: 1.5, ease: "power2.out"
        }, "shot5+=1.0")
        .to(".shot-5 .db-table tbody", {
          y: 3, duration: 1.5, ease: "power2.out"
        }, "shot5+=1.0")
        // MORPH TRANSITION 5→6: db rows compress and rise at 18.7s
        // Table rows become more compact, foreshadowing search results
        .to(".shot-5 .db-table tbody tr", {
          scaleY: 0.6, y: -15, opacity: 0.4,
          stagger: 0.03, duration: 0.6, ease: "power2.in"
        }, "shot5+=3.5")
        .to(".shot-5 .db-window", {
          scaleX: 0.7, scaleY: 0.9, y: -30, opacity: 0.4,
          duration: 0.7, ease: "power2.in"
        }, "shot5+=3.5")
        .to(".shot-5 .db-toolbar", {
          y: -20, opacity: 0.2,
          duration: 0.6, ease: "power2.in"
        }, "shot5+=3.5")
        // Shot 5 EXIT: fade begins at 19.2s
        .to(".shot-5", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot5+=4.0");

      // ============================================================
      // SHOT 6: Feature — AI Search (19.2-24.0s)
      // Camera enters: INHERITED from Shot 5 exit (scale:1.28, rotationX:-2, xPercent:2)
      //   → the deep z-push REVERSES: camera pulls back and tilts up
      // Camera exits: PULL-BACK + TILT (scale:1.18, rotationY:-2, rotationX:0)
      // Transition to Shot 7: Camera continues pulling back into crane shot,
      //   workspace emerges from below
      // MORPH: search-window expands horizontally to become workspace-preview
      // ============================================================
      tl.addLabel("shot6", 19.2);
      tl.set(".shot-6", { opacity: 1 }, "shot6")
        // CONTINUOUS ACTION: Camera was deep in database (scale:1.28, rotationX:-2).
        .to(camera, {
          scale: 1.18, rotationY: -2, rotationX: 0, xPercent: 0,
          duration: 0.8, ease: "power3.inOut"
        }, "shot6")
        // Search window drops from z-space
        .from(".shot-6 .search-window", {
          opacity: 0, y: -50, z: -100, rotationX: -15,
          duration: 0.8, ease: "expo.out"
        }, "shot6+=0.2")
        .from(".shot-6 .search-input-bar", {
          opacity: 0, y: -20, rotationZ: -3, z: 20,
          duration: 0.5, ease: "power3.out"
        }, "shot6+=0.4")
        // Results arc in from left
        .from(".shot-6 .search-result", {
          opacity: 0, x: -40, rotationZ: 4, z: 30,
          stagger: 0.08, duration: 0.55, ease: "expo.out"
        }, "shot6+=0.6")
        // AI answer rises from below
        .from(".shot-6 .search-ai-answer", {
          opacity: 0, y: 25, z: 40, rotationX: 6,
          duration: 0.7, ease: "power3.out"
        }, "shot6+=1.2")
        // Parallax
        .to(".shot-6 .search-results", {
          y: -6, duration: 1.2, ease: "power2.out"
        }, "shot6+=1.0")
        .to(".shot-6 .search-input-bar", {
          y: 3, duration: 1.2, ease: "power2.out"
        }, "shot6+=1.0")
        // MORPH TRANSITION 6→7: search-window expands at 22.7s
        // Narrow search window stretches wide to become workspace preview
        .to(".shot-6 .search-window", {
          scaleX: 1.6, scaleY: 1.2, y: 20, opacity: 0.4,
          duration: 0.7, ease: "power2.in"
        }, "shot6+=3.5")
        .to(".shot-6 .search-result", {
          x: 30, scale: 0.8, opacity: 0.3,
          stagger: 0.02, duration: 0.6, ease: "power2.in"
        }, "shot6+=3.5")
        .to(".shot-6 .search-ai-answer", {
          y: 30, opacity: 0.2,
          duration: 0.6, ease: "power2.in"
        }, "shot6+=3.5")
        // Shot 6 EXIT: fade begins at 23.2s
        .to(".shot-6", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot6+=4.0");

      // ============================================================
      // SHOT 7: Value — Live team workspace (23.2-30.0s)
      // Camera enters: INHERITED from Shot 6 exit (scale:1.18, rotationY:-2, rotationX:0)
      //   → the pull-back continues and becomes a CRANE shot
      // Camera exits: CRANE WIDE (scale:0.95, rotationX:3, yPercent:-4)
      // Transition to Shot 8: Camera continues the crane movement but freezes
      //   as the brand logo emerges from the depth of the workspace
      // MORPH: workspace elements contract toward center, converging into cta-logo
      // ============================================================
      tl.addLabel("shot7", 23.2);
      tl.set(".shot-7", { opacity: 1 }, "shot7")
        // CONTINUOUS ACTION: Camera was pulling back from search (scale:1.18, rotationY:-2).
        .to(camera, {
          scale: 0.95, rotationX: 3, yPercent: -4, rotationY: 0,
          duration: 1.2, ease: "expo.inOut"
        }, "shot7")
        // Workspace emerges from below
        .from(".shot-7 .workspace-preview", {
          opacity: 0, y: 60, z: -80, rotationX: 10,
          duration: 1.0, ease: "expo.out"
        }, "shot7+=0.2")
        .from(".shot-7 .sidebar-item", {
          opacity: 0, x: -35, rotationZ: -5, z: 30,
          stagger: 0.07, duration: 0.6, ease: "expo.out"
        }, "shot7+=0.4")
        .from(".shot-7 .live-cursor", {
          opacity: 0, scale: 0.6, z: -30, rotationY: 30,
          stagger: 0.12, duration: 0.6, ease: "back.out(1.4)"
        }, "shot7+=0.8")
        .from(".shot-7 .workspace-h1", {
          opacity: 0, y: 14, rotationX: 4,
          duration: 0.7, ease: "power3.out"
        }, "shot7+=1.0")
        .from(".shot-7 .workspace-line", {
          opacity: 0, y: 10, rotationX: 2,
          stagger: 0.06, duration: 0.45, ease: "power3.out"
        }, "shot7+=1.2")
        .from(".shot-7 .workspace-line.highlight", {
          opacity: 0, scale: 0.98, z: 10, duration: 0.7, ease: "power2.out"
        }, "shot7+=1.8")
        .from(".shot-7 .comment-bubble", {
          opacity: 0, scale: 0.8, x: 30, rotationZ: 6, z: 40,
          duration: 0.55, ease: "back.out(1.3)"
        }, "shot7+=2.2")
        // Parallax
        .to(".shot-7 .workspace-sidebar", {
          x: -8, y: -3, duration: 2.2, ease: "power2.out"
        }, "shot7+=0.5")
        .to(".shot-7 .workspace-main", {
          x: 5, y: 2, duration: 2.2, ease: "power2.out"
        }, "shot7+=0.5")
        .to(".shot-7 .workspace-preview", {
          y: 6, rotationX: -2, duration: 2.2, ease: "power2.out"
        }, "shot7+=0.5")
        // MORPH TRANSITION 7→8: workspace contracts toward center at 28.7s
        // All elements drift inward and scale down, converging into the logo space
        .to(".shot-7 .workspace-preview", {
          scale: 0.6, y: -40, opacity: 0.3,
          duration: 0.7, ease: "power2.in"
        }, "shot7+=5.5")
        .to(".shot-7 .workspace-sidebar", {
          x: 100, opacity: 0.2,
          duration: 0.6, ease: "power2.in"
        }, "shot7+=5.5")
        .to(".shot-7 .workspace-main", {
          scale: 0.8, y: 20, opacity: 0.3,
          duration: 0.6, ease: "power2.in"
        }, "shot7+=5.5")
        .to(".shot-7 .live-cursor", {
          scale: 0.5, x: -50, opacity: 0.1,
          stagger: 0.02, duration: 0.6, ease: "power2.in"
        }, "shot7+=5.5")
        .to(".shot-7 .comment-bubble", {
          scale: 0.5, y: -30, opacity: 0.1,
          duration: 0.6, ease: "power2.in"
        }, "shot7+=5.5")
        // Shot 7 EXIT: fade begins at 29.2s
        .to(".shot-7", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "shot7+=6.0");

      // ============================================================
      // SHOT 8: CTA — Final (29.2-36.0s)
      // Camera enters: INHERITED from Shot 7 exit (scale:0.95, rotationX:3, yPercent:-4)
      //   → the crane shot continues but the workspace fades to white
      //   → camera settles to neutral as the brand emerges from depth
      // Camera exits: Z-AXIS THRUST (scale:1.0, all neutral) then logo from z:-300
      // No next shot — final hold
      // OVERLAP: 29.2-30.0s (shot 7 fading, shot 8 entering)
      // ============================================================
      tl.addLabel("shot8", 29.2);
      tl.set(".shot-8", { opacity: 1 }, "shot8")
        // CONTINUOUS ACTION: Camera was in crane shot (scale:0.95, rotationX:3, yPercent:-4).
        // It settles to neutral while the brand emerges from the depth.
        .to(camera, {
          scale: 1.0, rotationX: 0, rotationY: 0, rotationZ: 0, yPercent: 0, z: 0,
          duration: 0.8, ease: "power3.inOut"
        }, "shot8")
        // Logo Z-AXIS THRUST from deep space — emerges from where workspace contracted
        .from(".shot-8 .cta-logo", {
          opacity: 0, scale: 0.6, z: -300, rotationY: -25,
          duration: 1.0, ease: "expo.out"
        }, "shot8+=0.2")
        // SplitText headline reveal
        .from(ctaSplit.lines, {
          yPercent: 110, stagger: 0.1, duration: 1.0, ease: "expo.out"
        }, "shot8+=0.6")
        .from(".shot-8 .cta-body", {
          opacity: 0, y: 14, z: 20, duration: 0.5, ease: "power3.out"
        }, "shot8+=1.4")
        .from(".shot-8 .cta-btn-primary", {
          opacity: 0, y: 16, rotationZ: -3, z: 30, duration: 0.5, ease: "expo.out"
        }, "shot8+=1.7")
        .from(".shot-8 .cta-btn-secondary", {
          opacity: 0, y: 16, rotationZ: 3, z: 30, duration: 0.5, ease: "expo.out"
        }, "shot8+=1.85")
        .from(".shot-8 .cta-sub", {
          opacity: 0, y: 8, duration: 0.4, ease: "power3.out"
        }, "shot8+=2.1")
        // Primary CTA loopPulse
        .to(".shot-8 .cta-btn-primary", {
          scale: 1.04, duration: 0.5, yoyo: true, repeat: 3, repeatDelay: 0.3, ease: "sine.inOut"
        }, "shot8+=2.8")
        // Final hold
        .to({}, { duration: 2.2 });

      // ============================================================
      // STUDIO CONTRACT (G6)
      // ============================================================
      window.__studio = { gsap, tl, duration: () => tl.duration() };
      window.dispatchEvent(new Event("__studio:ready"));

      console.log("Scene ready. Duration:", tl.duration().toFixed(2), "s");
    });
  }
);
