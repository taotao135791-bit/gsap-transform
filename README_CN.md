# GSAP Transform

面向 coding agent 的 Motion Director。

GSAP Transform 是一个 community / third-party / agent-oriented 的 GSAP
动效 skill system。它让 agent 先判断审美，再编辑 motion state，最后生成可预览、可渲染的 GSAP 动效作品。

这不是 GreenSock 官方项目，也不是 Webflow 官方项目。

[English README](./README.md)

## 这是什么

这是给 Codex、Cursor、Claude Code、Gemini、Copilot、Windsurf 等 coding
agent 使用的 GSAP motion skill system。

默认路径是：

```text
Brief / product context
  -> Design Read
  -> motion dials
  -> state.json edits
  -> primitives
  -> generated scene
  -> preview/render
  -> anti-slop check
```

## 这不是什么

- 不是 GreenSock 官方项目。
- 不是 Webflow 官方集成。
- 不是 GSAP 官方文档替代品。
- 不是通用视频剪辑器。
- 不是自动审美保证器。
- 不是要求普通 agent 默认手改 generated `scene.js`。

## 为什么需要它

AI coding agent 很容易生成同一套默认审美：

- 全站 `Inter`
- 深色底 + AI 紫渐变
- 居中 hero + 三张 feature card
- 默认 `back.out(1.7)`
- 每个 section 都 parallax
- hover 同时 lift + scale + shadow
- 没有 `prefers-reduced-motion`

GSAP API 很强，但 agent 在写 API 之前需要更强的产品判断和 motion 方向。

## 三层架构

### Design Layer / 设计层

最先加载。它先读 brief、产品上下文、品牌上下文，再决定动效方向。

包含：

| Skill | 职责 |
|---|---|
| `motion-design-taste` | Design Read、三调节杆、motion mode、路由 |
| `motion-anti-slop` | 反默认 AI 味的确定性检查 |
| `video-grammar` | 视频语法、镜头、运镜、转场、节奏 |

设计层设置：

- `MOTION_INTENSITY`
- `DESIGN_VARIANCE`
- `VISUAL_DENSITY`

它决定后续应该调用哪些 State/API skills。

### State Layer / 状态层

默认编辑层。它把动效时间线变成可读、可查、可改、可验证的数据。

包含：

| 资产 | 职责 |
|---|---|
| `motion-state` | `state.json` schema 和 runtime |
| `motion-primitives` | 可复用 motion verbs，例如 `fadeUp`、`splitReveal`、`cameraPush` |
| `templates/` | 可复用 `state.json` skeleton |
| `state.json` workflow | 默认 source of truth |

默认情况下，agent 编辑 `state.json`，而不是直接手改 generated `scene.js`。

`scene.js` / `scene.mjs` 是 generated artifact。
高级用户仍然可以把手写 scene 当作 escape hatch，
但普通 agent workflow 不默认这么做。

### API Layer / API 层

在 Design 和 State 之后，需要具体实现时再加载。

包含：

| Skill | 职责 |
|---|---|
| `gsap-core` | tween、transform、`autoAlpha`、`matchMedia` |
| `gsap-timeline` | 编排、label、position parameter |
| `gsap-scrolltrigger` | scroll motion、pin、scrub、cleanup |
| `gsap-plugins` | SplitText、MorphSVG、DrawSVG、MotionPath、Flip、Draggable 等 |
| `gsap-react` | React 生命周期和 `useGSAP` |
| `gsap-frameworks` | Vue、Nuxt、Svelte 生命周期和清理 |
| `gsap-performance` | transform、batching、`will-change`、渲染安全 |

API 层是实现层，不是产品主入口。

## Quickstart

```bash
git clone https://github.com/taotao135791-bit/gsap-transform.git
cd gsap-transform
npm run verify
npm test
npm run pick product-hero-reveal
node scripts/state-to-scene.mjs projects/product-hero-reveal
cd projects/product-hero-reveal
npm install
node serve.mjs
node render.mjs --preset vertical --dry-run
```

`npm run pick product-hero-reveal` 会把真实模板复制到
`projects/product-hero-reveal/`，并运行生成器。

日常编辑循环：

```bash
# edit projects/{slug}/state.json
node scripts/state-to-scene.mjs projects/{slug}
# refresh the preview
```

## Agent workflow

Agent 应该按这个顺序做：

1. 读 brief，输出 Design Read。
2. 设置 `MOTION_INTENSITY`、`DESIGN_VARIANCE`、`VISUAL_DENSITY`。
3. 选择或调整一个 template state。
4. 编辑 `state.json`。
5. 用 primitives 表达 beats。
6. 生成 `scene.js`。
7. 预览或渲染。
8. 跑 anti-slop 检查。
9. 修改仓库后运行 `npm run verify` 和 `npm test`。

## Templates

模板位于 `templates/{slug}/`。

每个模板都是可复用的 `state.json` skeleton，并带 README。它们是 agent 工作的起点，不只是 demo。

选择模板：

```bash
npm run pick product-hero-reveal
```

列出模板：

```bash
node scripts/pick-template.mjs
```

## State workflow

完整 state contract 见 [docs/SPEC.md](./docs/SPEC.md)。

核心字段包括：

- `schemaVersion`
- `duration`
- `fps`
- `width`
- `height`
- `layers`
- `beats`
- optional `assets`

每个 beat 都命名一个 primitive，并引用一个 layer。
未知 primitive、缺失 layer、错误 timing、不兼容 layer type 都应该验证失败。

## Adapter coverage

除了 `skills/{name}/SKILL.md`，本仓库还提供 agent-specific adapters。

| Agent | Adapter file(s) |
|---|---|
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md`, `.claude-plugin/` |
| Gemini / Antigravity | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/{skill}.instructions.md` |
| Cursor | `.cursor/rules/{skill}.mdc`, `.cursor-plugin/` |
| Windsurf | `.windsurf/rules/gsap.md`, `.windsurfrules` |

修改 skill 时，必须同步它的 adapters。

## Validation

运行：

```bash
npm run verify
npm test
```

`npm run verify` 检查 adapter 一致性、skill metadata、primitive 覆盖、template 数量和 Windsurf 同步。

`npm test` 运行 primitives、state validation、templates 的 Node 测试。

## 常见失败模式

- 默认手改 generated `scene.js`。
- 跳过 Design Layer，直接堆 GSAP API。
- 把 `state.json` 当成普通 agent workflow 里的可选项。
- 新增 primitive 但没更新 registry、docs、tests。
- 新增 template 但没有可验证的 `state.json`。
- 修改 skill 但没同步 Cursor、Copilot、Windsurf adapters。

## Contributing

见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

保持产品路径小而可验证：

```text
Design Layer -> State Layer -> API Layer
```

不要为了绿色结果降低 verify 或 test 标准。

## License

MIT
