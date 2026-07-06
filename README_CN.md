```text
  ███╗   ███╗ ██████╗ ████████╗██╗ ██████╗ ███╗   ██╗
  ████╗ ████║██╔═══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
  ██╔████╔██║██║   ██║   ██║   ██║██║   ██║██╔██╗ ██║
  ██║╚██╔╝██║██║   ██║   ██║   ██║██║   ██║██║╚██╗██║
  ██║ ╚═╝ ██║╚██████╔╝   ██║   ██║╚██████╔╝██║ ╚████║
  ╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
  ██████╗ ███████╗███████╗██╗ ██████╗ ███╗   ██╗
  ██╔══██╗██╔════╝██╔════╝██║██╔════╝ ████╗  ██║
  ██║  ██║█████╗  ███████╗██║██║  ███╗██╔██╗ ██║
  ██║  ██║██╔══╝  ╚════██║██║██║   ██║██║╚██╗██║
  ██████╔╝███████╗███████║██║╚██████╔╝██║ ╚████║
  ╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝

  GSAP Skills
  ──●────●────●────●────●────●──
  不是文档搬运。是让 agent 做出来的东西，不像 AI 做的。
```

[English README →](./README.md)

# GSAP Motion Design Skills · 中文说明

> 一套规则，让 AI agent 停止产出千篇一律的 `Inter` + 紫色渐变 + `back.out(1.7)` + 居中 hero。

这是一个 community / third-party / agent-oriented 的 GSAP motion skill 仓库，不是 GreenSock 或 Webflow 官方发布的包。

三层体系：**Design Layer / 设计层**教 agent「品味」（brief 推断、三调节杆、配方、反 AI-tell 规则），**State Layer / 状态层**把时间线保存成可编辑数据，**API Layer / API 层**教 agent「正确的 GSAP 实现」。设计层在写任何代码之前触发，状态层承载编辑循环，API 层在写代码时触发。

---

## 为什么做这个

每个 AI 编码 agent 都在同样的 SaaS 模板上训练。你说"做一个带动画的落地页"，它交出来的一定是：

- 全站 `Inter`
- 深色底 + AI 紫渐变 + 径向发光模糊
- 居中 hero + 下面三等分 feature cards
- 每个入场动画都用 `back.out(1.7)`
- 每个 section 都有 parallax + scrub
- 不带 `prefers-reduced-motion` 分支

这些就是"AI slop"。GSAP API 很强，但给 agent 的设计方向不够强。**这套 skill 解决方向问题。**

---

## 三层架构

```
┌────────────────────────────────────────────────────────────────┐
│  设计层（先加载 — 写代码之前）                                  │
│                                                                │
│  motion-design-taste   → brief 推断、三调节杆、动效模式        │
│  motion-recipes        → 8 个「审美 × 动效」配方可直接克隆     │
│  motion-anti-slop      → 7 组 32+ 条确定性检测规则             │
│  motion-craft          → 11 个命令（/init … /studio /export）  │
│  motion-studio         → 预览工程 + 渲染 mp4/webm/mov          │
│  video-grammar         → 镜头/运镜/转场/BPM 节奏               │
└────────────────────────────────────────────────────────────────┘
                          ↓ 声明
┌────────────────────────────────────────────────────────────────┐
│  状态层（State Layer）                                         │
│                                                                │
│  motion-state          → state.json schema + runtime           │
│  motion-primitives     → 16 个动效原语                         │
│  templates/            → 可克隆的 state.json 模板              │
└────────────────────────────────────────────────────────────────┘
                          ↓ 路由到
┌────────────────────────────────────────────────────────────────┐
│  API 层（API Layer，后加载 — 写 GSAP 代码时）                  │
│                                                                │
│  gsap-core · gsap-timeline · gsap-scrolltrigger · gsap-plugins │
│  gsap-utils · gsap-react · gsap-frameworks · gsap-performance  │
└────────────────────────────────────────────────────────────────┘
```

设计层读 brief → 输出一行 **Design Read** → 设三调节杆（`MOTION_INTENSITY`, `DESIGN_VARIANCE`, `VISUAL_DENSITY`）→ 选动效模式（克制 / 表现 / 电影感）→ 状态层保存可编辑时间线 → 路由到对应 API skill。上线前仍要跑 32+ 条 anti-slop 规则。

---

## 工作流（agent 实际走的 5 步）

```
1. motion-design-taste    "判断为：agency 落地页, Cinematic 模式, 8/8/3。"
2. motion-recipes         克隆 Editorial Kinetic 骨架。
3. gsap-* API skills      加载 gsap-scrolltrigger + gsap-plugins (SplitText)。
4. motion-anti-slop       走 A→G 七组检查。每个 block 规则必须修复。
5. motion-craft /audit    结构化报告 → /polish → /adapt（无障碍化）。
```

没有一步可以跳过。跳第 1 步就是 slop 的起源。

---

## 安装

### npx skills（推荐）

```bash
npx skills add https://github.com/taotao135791-bit/gsap-transform
```

支持任何兼容 [Agent Skills 格式](https://agentskills.io) 的 agent。以下 agent 额外提供了**专用适配文件**（见下表）。

### 适配覆盖

除了通用的 `skills/<name>/SKILL.md` 格式，本仓库为以下 agent 提供了专用配置文件：

| Agent | 适配文件 | 你得到什么 |
|-------|---------|---------|
| **Claude Code** | `CLAUDE.md`（→`AGENTS.md`）、`.claude-plugin/{plugin,marketplace}.json` | 会话启动时加载硬规则 + 插件市场安装 |
| **OpenAI Codex** | `AGENTS.md` | 会话启动时加载硬规则（Codex 官方标准） |
| **GitHub Copilot** | `.github/copilot-instructions.md` + `.github/instructions/<skill>.instructions.md`（16 个路径规则文件） | 仓库级提示 + 路径触发的每-skill 规则 |
| **Cursor** | `.cursor-plugin/{plugin,marketplace}.json`（远程）+ `.cursor/rules/<skill>.mdc`（16 个项目级规则，含 `globs:` frontmatter） | 市场安装 + 按路径自动附加的每-skill 规则 |
| **Google Gemini / Antigravity** | `GEMINI.md`（→`AGENTS.md`） | 会话启动时加载硬规则 |
| **Windsurf** | `.windsurf/rules/gsap.md`（新版格式）+ `.windsurfrules`（旧版回退） | 项目级硬规则 |

任何支持 `skills/<name>/SKILL.md` 格式的 agent（OpenCode、Pi、Qoder 及其他多数 Agent Skills 客户端）可通过下面的“手动拷贝”使用。

### Claude Code

```
/plugin marketplace add taotao135791-bit/gsap-transform
```

### Cursor

两种安装方式：
- **远程规则市场** — Settings → Rules → Add Rule → Remote Rule (Github) → `taotao135791-bit/gsap-transform`。
- **项目级** — 拷贝 `.cursor/rules/` 到你的项目，打开匹配 `globs` 的文件时 Cursor 会自动附加对应 skill。

### GitHub Copilot

拷贝 `.github/copilot-instructions.md` 和整个 `.github/instructions/` 目录到你项目的 `.github/` 下。Copilot 会自动读取。

### Windsurf

拷贝 `.windsurf/rules/gsap.md` 到项目（新版格式）；旧版 Windsurf 拷贝 `.windsurfrules` 到项目根目录。

### 手动拷贝（任何兼容 Agent Skills 的 agent）

| Agent | Skill 目录 |
|-------|-----------|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| OpenCode | `~/.config/opencode/skills/` |
| OpenAI Codex | `~/.codex/skills/` |
| Google Antigravity | `~/.gemini/antigravity/skills/` |
| Pi | `~/.pi/agent/skills/` |
| Qoder | `~/.qoder/skills/` |

---

## Skill 索引 — 从用户问题出发

### "写代码之前我想要设计方向"

| 加载 | 干什么 |
|------|--------|
| **motion-design-taste** | brief 推断 → Design Read → 三调节杆 → 动效模式 → 路由到 API skill |
| **motion-recipes** | 8 个配方：Editorial Kinetic / Brutalist Scroll / Liquid Glass Hover / Bento Flip / Minimal Fade / Cinematic Pinned Scrub / Kinetic Type Stagger / Grid Break Overlap |
| **motion-anti-slop** | 7 组 32+ 条规则，每条有检测特征、错误示例、修复方法、严重度（block / warn） |
| **motion-craft** | 11 命令：`/init` `/shape` `/animate` `/polish` `/audit` `/critique` `/quieter` `/bolder` `/adapt` `/studio` `/export` |
| **motion-studio** | 预览工程模板 + `render.mjs`（mp4/webm/mov · 1080p/4k/vertical/square）+ `serve.mjs` 时间轴预览。`/studio` 产出可拖动 + 可渲染的独立文件夹 |
| **video-grammar** | 景别 / 虚拟摄像机（`.camera` 推/拉/摇）/ 转场 / BPM 节奏同步 / 画幅安全区。产出是视频时与 motion-design-taste 一起加载 |

### "写代码时需要正确的 GSAP 用法"

| 加载 | 覆盖 |
|------|------|
| **gsap-core** | `to / from / fromTo / set`、缓动、stagger、`matchMedia`、transform 别名、`autoAlpha` |
| **gsap-timeline** | 编排、位置参数、标签、嵌套 |
| **gsap-scrolltrigger** | pin、scrub、batch、refresh、containerAnimation、scrollerProxy |
| **gsap-plugins** | SplitText、MorphSVG、DrawSVG、MotionPath、Flip、Draggable、Inertia、Observer、CustomEase、ScrambleText、Physics2D 等 |
| **gsap-utils** | clamp、mapRange、interpolate、distribute、snap、wrap、toArray、pipe |
| **gsap-react** | `useGSAP` hook、scope、contextSafe、SSR |
| **gsap-frameworks** | Vue / Nuxt / Svelte 生命周期 + 清理 |
| **gsap-performance** | `quickTo`、transform-only、`will-change`、batch vs loop |

---

## 设计层实际阻止了什么（对照表）

| 没有这套 skill | 有了之后 |
|---|---|
| `ease: "back.out(1.7)"` 全场默认 | 只允许一次品牌性格时刻；默认 `expo.out / power3.out` 按动效模式带 |
| `Inter` + slate-900 全站 | Design Read 选字体池；只有 brief 说 "Linear-style" 时才允许 Inter |
| 紫色渐变 hero + 径向发光 | accent 从 brief 推断；默认紫被 Section 4 "Lila Rule" 拦住 |
| 无 `prefers-reduced-motion` | 全程 `gsap.matchMedia()` 包裹；缺失即 Pre-Flight Failure |
| 每个 section 都有 `parallax` | parallax 最多允许 1-2 个 section（Anti-Slop C4） |
| hover 三件套 `y:-8 + scale:1.05 + shadow` | 只选一种信号（Anti-Slop C3） |
| `cdn.jsdelivr.net/npm/gsap/<Plugin>.js` 做浏览器 ESM | `esm.sh` + default import（Anti-Slop G3 + G4） |
| `gsap.from(autoAlpha:0)` 写在 CSS `opacity:0` 元素上 | 用 `gsap.fromTo` 显式起终点（Anti-Slop G1） |

---

## 三调节杆（核心概念）

每个项目的设计方向被 3 个 dial 数值化，让 agent 不再靠"感觉"：

| 调节杆 | 1（低） | 10（高） | 示例值 |
|---|---|---|---|
| **MOTION_INTENSITY** | 几乎静态 | 电影感、钉住 scrub、kinetic 字体 | SaaS B2B = 3; awwwards agency = 9 |
| **DESIGN_VARIANCE** | 完美对称、居中、可预测 | 非对称、重叠、打破 grid | 公共部门 = 3; editorial = 8 |
| **VISUAL_DENSITY** | 美术馆级留白 | 驾驶舱级密集信息 | 品牌落地页 = 3; dashboard = 8 |

---

## 8 个配方（一句话简介）

| 配方 | 一句话 |
|------|--------|
| Editorial Kinetic | 编辑排版 + SplitText 行遮罩 + 单 accent + 克制 parallax |
| Brutalist Scroll | 野兽派 + 巨大数字 + 钉住 scrub + Flip 网格 |
| Liquid Glass Hover | 深空黑 + 玻璃卡片 + 磁性 CTA + 光斑追踪 |
| Bento Flip | 非等分 tile + ScrollTrigger.batch + Flip 展开 |
| Minimal Fade | 极简 autoAlpha + 小 y + 无 scrub/pin + 最克制 |
| Cinematic Pinned Scrub | 全屏钉住 + 多层 parallax + SplitText + MorphSVG |
| Kinetic Type Stagger | 字体占满视口 + char stagger + expo.out |
| Grid Break Overlap | 非对称网格 + 元素交叉重叠 + 差速 y |

---

## 目录结构

```
gsap-transform/
  README.md / README_CN.md
  AGENTS.md
  skills/
    # 设计层
    motion-design-taste/  SKILL.md
    motion-recipes/       SKILL.md
    motion-anti-slop/     SKILL.md
    motion-craft/         SKILL.md
    # API 层
    gsap-core/            SKILL.md
    gsap-timeline/        SKILL.md
    gsap-scrolltrigger/   SKILL.md
    gsap-plugins/         SKILL.md
    gsap-utils/           SKILL.md
    gsap-react/           SKILL.md
    gsap-performance/     SKILL.md
    gsap-frameworks/      SKILL.md
  examples/
    vanilla/ react/ vue/ nuxt/
    showcase/
      editorial-kinetic/
      brutalist-scroll/
      liquid-glass-hover/
```

---

## GSAP 完全免费

> 所有插件 — SplitText、MorphSVG、DrawSVG、Flip、Draggable、全部 — 在 Webflow 收购 GSAP 后 **100% 免费**。从公开 `gsap` npm 包安装即可，无需 `.npmrc`，无需 auth token，无需 Club 会员。

---

## License

MIT
