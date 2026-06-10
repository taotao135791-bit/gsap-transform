```text
   ██████╗ ███████╗ █████╗ ██████╗
  ██╔════╝ ██╔════╝██╔══██╗██╔══██╗
  ██║  ███╗███████╗███████║██████╔╝
  ██║   ██║╚════██║██╔══██║██╔═══╝
  ╚██████╔╝███████║██║  ██║██║
   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝

  Motion Design Skills
  ──●────●────●────●────●────●──
  不是文档搬运。是让 agent 做出来的东西，不像 AI 做的。
```

[English README →](./README.md)

# GSAP Motion Design Skills · 中文说明

> 一套规则，让 AI agent 停止产出千篇一律的 `Inter` + 紫色渐变 + `back.out(1.7)` + 居中 hero。

双层体系：**设计层**教 agent「品味」（brief 推断、三调节杆、配方、反 AI-tell 规则），**API 层**教 agent「正确的 GSAP 实现」。设计层在写任何代码之前触发；API 层在写代码时触发。

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

## 双层架构

```
┌────────────────────────────────────────────────────────────────┐
│  设计层（先加载 — 写代码之前）                                  │
│                                                                │
│  motion-design-taste   → brief 推断、三调节杆、动效模式        │
│  motion-recipes        → 8 个「审美 × 动效」配方可直接克隆     │
│  motion-anti-slop      → 7 组 32+ 条确定性检测规则             │
│  motion-craft          → 9 个命令（/init /shape /animate ...）  │
└────────────────────────────────────────────────────────────────┘
                          ↓ 路由到
┌────────────────────────────────────────────────────────────────┐
│  API 层（后加载 — 写 GSAP 代码时）                             │
│                                                                │
│  gsap-core · gsap-timeline · gsap-scrolltrigger · gsap-plugins │
│  gsap-utils · gsap-react · gsap-frameworks · gsap-performance  │
└────────────────────────────────────────────────────────────────┘
```

设计层读 brief → 输出一行 **Design Read** → 设三调节杆（`MOTION_INTENSITY`, `DESIGN_VARIANCE`, `VISUAL_DENSITY`）→ 选动效模式（克制 / 表现 / 电影感）→ 路由到对应 API skill。并在上线前跑 32+ 条 anti-slop 规则。

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
npx skills add https://github.com/greensock/gsap-skills
```

支持 Cursor、Claude Code、Codex、Windsurf、Copilot、Google Antigravity 等 [40+ 个 agent](https://github.com/vercel-labs/skills#supported-agents)。

### Claude Code

```
/plugin marketplace add greensock/gsap-skills
```

### Cursor

**Settings → Rules → Add Rule → Remote Rule (Github)** → `greensock/gsap-skills`。

### 手动拷贝

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
| **motion-craft** | 9 命令：`/init` `/shape` `/animate` `/polish` `/audit` `/critique` `/quieter` `/bolder` `/adapt` |

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
gsap-skills/
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
