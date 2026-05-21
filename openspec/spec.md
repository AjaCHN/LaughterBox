# LaughterBox 技术规范 (OpenSpec)

## 项目概述

### 基本信息

| 项目名称 | LaughterBox (笑话大集合) |
|---------|-------------------------|
| 当前版本 | v5.7.0 |
| 项目类型 | 渐进式 Web 应用 (PWA) |
| 项目描述 | 一个极简的笑话集合应用，旨在提供纯粹的阅读体验，包含 1000+ 条精选短篇笑话 |
| 作者 | Sut |
| 语言 | 中文 (zh-CN) |
| 发布日期 | 2024 |

### 项目特点

- **极简设计**: 专注于内容，界面清爽无干扰
- **自适应布局**: 针对手机、平板和桌面端进行全面优化
- **深色模式**: 支持系统级深色/浅色模式无缝切换
- **导航功能**: 支持随机导航和滑动切换（上一篇/下一篇）
- **PWA 支持**: 可安装到主屏幕，支持离线访问
- **高鲁棒性**: 完善的空数据处理和水合错误预防机制

### 技术栈

#### 核心框架

- **Next.js**: ^15.4.9 (App Router 架构)
- **React**: ^19.2.1
- **TypeScript**: ^5.9.3

#### UI 和样式

- **Tailwind CSS**: ^4.1.11 (CSS 框架)
- **Lucide React**: ^0.553.0 (图标库)

#### 动画和交互

- **Motion**: ^12.23.24 (Framer Motion 最新版本，原 motion/react)

#### 主题管理

- **next-themes**: ^0.4.6 (主题管理库)

#### PWA 支持

- **@ducanh2912/next-pwa**: ^10.2.9 (PWA 解决方案)

#### 工具库

- **tailwind-merge**: ^3.3.1 (Tailwind CSS 工具函数)
- **clsx**: ^2.1.1 (条件类名工具)
- **class-variance-authority**: ^0.7.1 (组件变体工具)
- **autoprefixer**: ^10.4.21 (CSS 后处理器)

---

## 核心功能

### 1. 随机笑话展示

**功能描述**: 应用加载时随机显示一条笑话，通过"换一个"按钮随机切换笑话内容。

**实现细节**:

- 应用启动时，从 `JOKES_DATA` 数组中随机选择一条笑话进行展示
- 点击随机按钮后，确保下一次显示的笑话与当前笑话不同
- 笑话内容显示在居中的卡片式容器中，采用大字号衬线体排版
- 卡片下方显示当前笑话的索引号和总笑话数（格式：`001 / 1012`）

**交互流程**:

1. 用户打开应用 → 系统延迟随机选择一条笑话 → 显示笑话卡片
2. 用户点击随机按钮 → 系统选择新的笑话（排除当前笑话）→ 播放过渡动画 → 显示新笑话

**边界情况处理**:

- 如果 `JOKES_DATA` 为空数组 → 显示"暂无笑话"提示文本
- 如果只有一条笑话 → 禁用随机按钮点击

### 2. 滑动切换

**功能描述**: 移动端支持左右滑动切换上一篇/下一篇笑话，并伴有流畅的水平滑动动画。

**实现细节**:

- 使用 Motion 的 `drag="x"` 属性实现水平拖拽
- 拖拽阈值设置为 50px，超过阈值触发切换
- 左滑（offset.x < -50）切换到下一条笑话
- 右滑（offset.x > 50）切换到上一条笑话
- 切换时循环浏览笑话列表（最后一条切换到第一条）

**动画效果**:

- 退出动画: 向滑动方向的反方向移动 + 透明度渐变 + 轻微缩小
- 进入动画: 从滑动方向移动到中心 + 透明度渐变 + 缩放恢复
- 动画时长: 0.25 秒
- 使用 `AnimatePresence` 的 `mode="wait"` 确保动画完成后切换内容

**边界情况处理**:

- 笑话数量 ≤ 1 时禁用滑动切换
- 拖拽时限制在水平方向（`dragConstraints: { left: 0, right: 0 }`）
- 拖拽弹性系数: 0.7 (`dragElastic={0.7}`)

### 3. 优雅排版

**功能描述**: 采用大字号衬线体，辅以装饰性引号和索引指示器，提供沉浸式阅读体验。

**排版规范**:

- **字体**: Noto Serif SC（Google Fonts）
  - 权重: 400 (正常), 700 (粗体)
  - 应用场景: 笑话内容展示
- **字号响应式**:
  - 移动端 (sm): 2xl (~24px)
  - 平板 (md): 3xl (~30px)
  - 桌面端 (lg): 4xl (~36px)
- **行高**: `leading-snug` (1.25)
- **字间距**: `tracking-tight` (-0.025em)
- **文本对齐**: 居中 (`text-center`)
- **最大宽度**: 90% 容器宽度

**装饰元素**:

- 左上角装饰引号: 180° 旋转的 Quote 图标，透明度 10%
- 右下角装饰引号: 正常方向的 Quote 图标，透明度 10%
- 索引指示器: 位于笑话下方，包含水平分隔线和 `XXX / YYY` 格式索引

### 4. 深色模式

**功能描述**: 支持系统级深色/浅色模式无缝切换。

**实现细节**:

- 使用 `next-themes` 库管理主题状态
- 主题属性设置为 `class`（通过 CSS 类切换）
- 默认主题: `system`（跟随系统设置）
- 主题切换按钮:
  - 浅色模式: 显示太阳图标
  - 深色模式: 显示月亮图标
  - 使用旋转和缩放动画实现图标切换

**颜色方案**:

| 元素 | 浅色模式 | 深色模式 |
|-----|---------|---------|
| 背景色 | `bg-neutral-50` (#fafafa) | `bg-neutral-950` (#030303) |
| 文字色 | `text-neutral-900` (#171717) | `text-neutral-50` (#fafafa) |
| 卡片背景 | `bg-white` (#ffffff) | `bg-neutral-900` (#171717) |
| 边框色 | `border-neutral-200/50` | `border-neutral-800/50` |
| 阴影 | `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` | `shadow-[0_8px_30px_rgb(0,0,0,0.2)]` |

**水合错误预防**:

- 使用 `mounted` 状态延迟渲染主题切换按钮
- 服务端和首次客户端渲染显示占位符，避免水合不匹配
- 过渡动画时长: 0.3 秒

### 5. PWA 支持

**功能描述**: 支持渐进式 Web 应用，可安装到主屏幕。

**配置内容**:

- **清单文件**: `/public/manifest.json`
- **应用图标**: 192x192px 和 512x512px SVG 图标
- **主题色**: #ffffff
- **显示模式**: standalone
- **Service Worker**: 使用 `@ducanh2912/next-pwa` 生成
- **离线支持**: 在生产环境启用 Service Worker

**元数据配置**:

```json
{
  "title": "LaughterBox v5.7.0",
  "description": "最全面的短篇笑话集合，每篇控制在 100 字以内。",
  "keywords": ["笑话", "幽默", "极简", "段子"],
  "robots": "index, follow",
  "appleWebApp": {
    "capable": true,
    "statusBarStyle": "default",
    "title": "LaughterBox"
  }
}
```

---

## 架构设计

### 目录结构

```
/workspace/
├── app/                          # Next.js App Router 目录
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局组件
│   ├── page.tsx                 # 主页面组件 (v5.7.0)
│   └── metadata.json            # 应用元数据
│
├── components/                   # React 组件目录
│   ├── joke-card.tsx            # 笑话卡片组件 (v4.0.0)
│   ├── theme-provider.tsx       # 主题提供者 (v4.0.0)
│   └── theme-toggle.tsx         # 主题切换按钮 (v5.3.2)
│
├── hooks/                        # 自定义 React Hooks
│   └── use-mobile.ts            # 移动设备检测 Hook
│
├── lib/                          # 工具函数和数据
│   ├── jokes-data.ts           # 笑话数据源 (v5.0.0, 1012 条笑话)
│   ├── utils.ts                # 通用工具函数
│   └── jokes-data.ts          # 笑话数据导出
│
├── openspec/                     # 项目规范文档
│   └── spec.md                  # OpenSpec 规范主文档
│
├── public/                       # 静态资源目录
│   ├── icon-192x192.svg        # PWA 图标 192px
│   ├── icon-512x512.svg        # PWA 图标 512px
│   └── manifest.json            # PWA 清单文件
│
├── .eslintrc.json               # ESLint 配置
├── .gitignore                   # Git 忽略文件
├── CHANGELOG.md                # 版本更新日志
├── eslint.config.mjs            # ESLint Flat Config
├── metadata.json                # 项目元数据
├── next.config.ts              # Next.js 配置
├── package.json                # 依赖管理
├── postcss.config.mjs          # PostCSS 配置
├── README.md                    # 中文说明文档
├── README_EN.md                # 英文说明文档
└── tsconfig.json                # TypeScript 配置
```

### 组件架构

#### 页面组件层次

```
<RootLayout>
  └── <ThemeProvider>
      └── <Page> (主页面)
          ├── <header> (顶部导航栏)
          │   ├── <div> (品牌标识)
          │   │   ├── <Sparkles> (图标)
          │   │   └── <h1> (标题)
          │   └── <ThemeToggle> (主题切换按钮)
          │
          └── <main> (主内容区)
              └── <div> (笑话查看器容器)
                  ├── <AnimatePresence>
                  │   └── <motion.div> (笑话卡片)
                  │       ├── <Quote> (装饰图标)
                  │       ├── <p> (笑话文本)
                  │       └── <div> (索引指示器)
                  │
                  └── <div> (导航控制区)
                      └── <button> (随机按钮)
                          └── <Shuffle> (图标)
```

#### 组件职责

| 组件名称 | 文件路径 | 职责 | 版本 |
|---------|---------|------|------|
| Page | app/page.tsx | 主页面，状态管理，交互逻辑 | v5.7.0 |
| ThemeProvider | components/theme-provider.tsx | 主题上下文提供者 | v4.0.0 |
| ThemeToggle | components/theme-toggle.tsx | 主题切换按钮 | v5.3.2 |
| JokeCard | components/joke-card.tsx | 笑话卡片组件（备用） | v4.0.0 |

### 状态管理

#### 本地状态 (useState)

| 状态名称 | 类型 | 用途 |
|---------|------|------|
| jokes | string[] | 笑话数据数组 |
| currentIndex | number | 当前显示笑话的索引 |
| mounted | boolean | 客户端挂载标志（防抖合错误） |
| direction | number | 动画方向（-1: 左, 0: 随机, 1: 右） |

#### 回调函数 (useCallback)

| 函数名称 | 用途 |
|---------|------|
| handleRandom | 随机切换到不同的笑话 |
| handleNext | 切换到下一条笑话 |
| handlePrev | 切换到上一条笑话 |

#### 生命周期 (useEffect)

| 用途 | 触发时机 |
|-----|---------|
| 初始化笑话索引 | 组件挂载时（延迟 0ms） |

### 数据流

```
JOKES_DATA (静态数据)
    ↓
Page 组件 (useState)
    ↓
├── jokes: 笑话数组
├── currentIndex: 当前索引
├── direction: 动画方向
    ↓
AnimatePresence + motion.div
    ↓
笑话内容渲染
```

---

## 关键组件规范

### 1. Page 组件 (app/page.tsx)

#### 组件签名

```typescript
export default function Page()
```

#### 状态管理

```typescript
const [jokes] = useState<string[]>(JOKES_DATA)
const [currentIndex, setCurrentIndex] = useState(0)
const [mounted, setMounted] = useState(false)
const [direction, setDirection] = useState(0)
```

#### 核心逻辑

**初始化逻辑**:
- 组件挂载后延迟 0ms 设置 `mounted = true`
- 同时随机设置 `currentIndex`
- 使用 `setTimeout` 确保客户端渲染完成

**随机算法**:
```typescript
const handleRandom = useCallback(() => {
  if (jokes.length <= 1) return
  setDirection(0) // 随机方向无滑动动画
  setCurrentIndex(prev => {
    let nextIndex = prev
    while (nextIndex === prev) {
      nextIndex = Math.floor(Math.random() * jokes.length)
    }
    return nextIndex
  })
}, [jokes.length])
```

**滑动切换**:
```typescript
const handleNext = useCallback(() => {
  if (jokes.length <= 1) return
  setDirection(1) // 向右滑动
  setCurrentIndex(prev => (prev + 1) % jokes.length)
}, [jokes.length])

const handlePrev = useCallback(() => {
  if (jokes.length <= 1) return
  setDirection(-1) // 向左滑动
  setCurrentIndex(prev => (prev - 1 + jokes.length) % jokes.length)
}, [jokes.length])
```

#### 渲染结构

```tsx
<div id="page-wrapper">
  <header id="main-header">
    <div id="header-content">
      <div id="brand-logo">
        <Sparkles /> + <h1>LaughterBox</h1>
      </div>
      <div id="header-actions">
        <ThemeToggle />
      </div>
    </div>
  </header>

  <main id="main-content">
    <div id="joke-viewer-container">
      <AnimatePresence mode="wait" custom={direction}>
        {mounted && (
          <motion.div
            drag="x"
            variants={variants}
            transition={transition}
          >
            <Quote /> + 笑话文本 + 索引指示器
          </motion.div>
        )}
      </AnimatePresence>

      <div id="nav-controls">
        <button id="btn-random">
          <Shuffle />
        </button>
      </div>
    </div>
  </main>
</div>
```

### 2. ThemeToggle 组件 (components/theme-toggle.tsx)

#### 组件签名

```typescript
export function ThemeToggle()
```

#### 实现要点

**水合错误预防**:

```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return <div className="placeholder" />
}
```

**主题切换逻辑**:

```typescript
<button onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}>
  <Sun className="dark:rotate-90 dark:scale-0" />
  <Moon className="absolute dark:rotate-0 dark:scale-100" />
</button>
```

### 3. ThemeProvider 组件 (components/theme-provider.tsx)

#### 组件签名

```typescript
export function ThemeProvider(props: React.ComponentProps<typeof NextThemesProvider>)
```

#### 配置参数

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### 4. JokeCard 组件 (components/joke-card.tsx)

#### 组件签名

```typescript
interface JokeCardProps {
  content: string
  index: number
}

export function JokeCard({ content, index }: JokeCardProps)
```

#### 功能特性

- 复制到剪贴板功能
- 入场动画（带延迟 stagger）
- 响应式布局

---

## 样式规范

### Tailwind CSS 配置

#### 版本信息

- Tailwind CSS: ^4.1.11
- @tailwindcss/postcss: 4.1.11
- @tailwindcss/typography: ^0.5.19

#### CSS 导入

```css
@import "tailwindcss";
```

### 响应式断点

| 断点 | 最小宽度 | 典型设备 |
|-----|---------|---------|
| 默认 | 0px | 手机竖屏 |
| sm | 640px | 手机横屏 |
| md | 768px | 平板 |
| lg | 1024px | 笔记本 |
| xl | 1280px | 桌面显示器 |

### 间距系统

| 名称 | 值 | 使用场景 |
|-----|---|---------|
| px | 4px | 小间距 |
| 4 | 16px | 组件内间距 |
| 6 | 24px | 区块间距 |
| 8 | 32px | 大间距 |
| 12 | 48px | 区域间距 |

### 字体系统

| 字体 | 来源 | 用途 | 权重 |
|-----|------|------|------|
| Noto Serif SC | Google Fonts | 笑话内容 | 400, 700 |
| 系统默认 | - | UI 元素 | - |
| font-mono | - | 索引数字 | - |

### 颜色系统

#### 语义颜色

| 语义 | 浅色值 | 深色值 | 用途 |
|-----|-------|-------|-----|
| 背景 | neutral-50 | neutral-950 | 页面背景 |
| 文字 | neutral-900 | neutral-50 | 主文字 |
| 卡片 | white | neutral-900 | 卡片背景 |
| 边框 | neutral-200/50 | neutral-800/50 | 分隔线 |
| 强调 | - | - | 按钮、链接 |

### 动画规范

#### 过渡时长

| 场景 | 时长 | CSS 类 |
|-----|-----|-------|
| 颜色过渡 | 300ms | `transition-colors duration-300` |
| 主题切换 | 300ms | `transition-colors duration-300` |
| 笑话切换 | 250ms | `transition duration-0.25` |
| 缩放动画 | 95ms | `active:scale-95` |

#### 动画变体

```typescript
const variants = {
  initial: (dir: number) => ({
    opacity: 0,
    scale: 0.98,
    x: dir === 0 ? 0 : dir * 50,
    y: dir === 0 ? 10 : 0
  }),
  animate: { opacity: 1, scale: 1, x: 0, y: 0 },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.98,
    x: dir === 0 ? 0 : dir * -50,
    y: dir === 0 ? -10 : 0
  })
}
```

---

## 动画设计

### 笑话卡片动画

#### 随机切换 (direction = 0)

- **入场 (initial → animate)**:
  - `x: 0 → 0`
  - `y: 10 → 0`
  - `opacity: 0 → 1`
  - `scale: 0.98 → 1`
  - 轻微的上浮效果，无水平位移

#### 顺序切换 (direction ≠ 0)

- **入场 (initial → animate)**:
  - 左滑进入: `x: 50 → 0`
  - 右滑进入: `x: -50 → 0`
  - `opacity: 0 → 1`
  - `scale: 0.98 → 1`

- **退场 (animate → exit)**:
  - 左滑退出: `x: 0 → -50`
  - 右滑退出: `x: 0 → 50`
  - `opacity: 1 → 0`
  - `scale: 1 → 0.98`

### 拖拽交互

#### 参数配置

```typescript
drag="x"                    // 启用水平拖拽
dragConstraints={{ left: 0, right: 0 }}  // 限制拖拽范围
dragElastic={0.7}          // 拖拽弹性
```

#### 触发阈值

```typescript
onDragEnd={(e, { offset }) => {
  if (offset.x < -50) {
    handleNext() // 左滑超过 50px，切换下一条
  } else if (offset.x > 50) {
    handlePrev() // 右滑超过 50px，切换上一条
  }
}}
```

### 主题切换动画

#### 图标旋转动画

```typescript
<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
```

- 太阳图标: `rotate-0 scale-100` → `-rotate-90 scale-0`
- 月亮图标: `rotate-90 scale-0` → `rotate-0 scale-100`
- 过渡时长: 继承父元素的 `transition-all`

---

## PWA 配置

### 清单文件 (public/manifest.json)

```json
{
  "name": "LaughterBox",
  "short_name": "LaughterBox",
  "description": "最全面的短篇笑话集合",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

### Next.js 配置 (next.config.ts)

```typescript
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['motion'],
  // ... 其他配置
}

export default withPWA(nextConfig)
```

### Service Worker 策略

- **开发环境**: 禁用 Service Worker
- **生产环境**: 启用 Service Worker
- **缓存策略**: 默认使用 `@ducanh2912/next-pwa` 的默认策略

---

## 开发规范

### 代码规范

#### ESLint 配置

- **配置文件**: `.eslintrc.json`, `eslint.config.mjs`
- **规则集**: Next.js 16.0.8 推荐的规则
- **构建时行为**: `ignoreDuringBuilds: true`

#### TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  }
}
```

### 命名规范

#### 文件命名

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件文件 | PascalCase.tsx | `ThemeToggle.tsx` |
| Hook 文件 | camelCase.ts | `useMobile.ts` |
| 工具文件 | camelCase.ts | `utils.ts` |
| 数据文件 | kebab-case.ts | `jokes-data.ts` |

#### 组件命名

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件名 | PascalCase | `ThemeToggle` |
| 导出的函数组件 | PascalCase | `export function ThemeToggle()` |
| 默认导出 | PascalCase | `export default function Page()` |

#### ID 命名

| 元素 | ID 格式 | 示例 |
|-----|--------|------|
| 页面容器 | `{name}-wrapper` | `page-wrapper` |
| 主头部 | `main-header` | `main-header` |
| 头部内容 | `header-content` | `header-content` |
| 品牌标识 | `brand-logo` | `brand-logo` |
| 主内容 | `main-content` | `main-content` |
| 笑话查看器 | `joke-viewer-container` | `joke-viewer-container` |
| 笑话卡片 | `joke-card-{index}` | `joke-card-0` |
| 笑话文本 | `joke-text` | `joke-text` |
| 随机按钮 | `btn-random` | `btn-random` |
| 主题切换 | `btn-theme-toggle` | `btn-theme-toggle` |
| 导航控制 | `nav-controls` | `nav-controls` |

### 组件版本管理

#### 版本标记格式

```typescript
// components/theme-toggle.tsx v5.3.2
```

#### 版本号规范

- 格式: `主版本.次版本.修订号`
- 主版本: 重大架构变更
- 次版本: 新功能添加
- 修订号: Bug 修复和小型改进

### 提交信息规范

#### 格式

```
<类型>(<范围>): <描述>

[可选正文]

[可选页脚]
```

#### 类型标识

| 类型 | 描述 |
|-----|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建或辅助工具 |

---

## 部署配置

### 构建命令

```bash
npm run build    # 生产构建
npm run dev      # 开发服务器
npm run start    # 生产服务器
npm run lint     # 代码检查
npm run clean    # 清理缓存
```

### 环境变量

| 变量名 | 描述 | 值 |
|-------|------|-----|
| NODE_ENV | 运行环境 | `development` / `production` |
| DISABLE_HMR | 禁用热模块替换 | `true` (AI Studio) |

### 构建产物

- **输出模式**: `standalone`
- **目标目录**: `.next/`
- **Service Worker**: 在 `public/` 目录生成

### 性能目标

| 指标 | 目标值 |
|-----|-------|
| First Contentful Paint (FCP) | < 1.8s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |

---

## 鲁棒性设计

### 空数据处理

```typescript
{jokes.length > 0 ? jokes[currentIndex] : "暂无笑话"}
```

- 当 `JOKES_DATA` 为空时，显示"暂无笑话"文本
- 索引指示器在空数据时隐藏
- 随机按钮在笑话数量 ≤ 1 时禁用

### 水合错误预防

#### 服务端与客户端渲染差异

**问题**: 服务端渲染的 HTML 与客户端首次渲染不一致会导致水合错误。

**解决方案**:

1. **延迟初始化**: 使用 `mounted` 状态延迟随机索引计算
```typescript
useEffect(() => {
  setMounted(true)
  setCurrentIndex(Math.floor(Math.random() * JOKES_DATA.length))
}, [])
```

2. **占位符渲染**: 在 `mounted` 为 false 时显示加载状态
```typescript
{!mounted && <LoadingSkeleton />}
```

3. **suppressHydrationWarning**: 在根元素添加属性
```tsx
<html lang="zh-CN" suppressHydrationWarning>
```

### 随机算法优化

#### 问题

连续点击随机按钮可能选中相同的笑话。

#### 解决方案

```typescript
const handleRandom = useCallback(() => {
  setCurrentIndex(prev => {
    let nextIndex = prev
    while (nextIndex === prev) {
      nextIndex = Math.floor(Math.random() * jokes.length)
    }
    return nextIndex
  })
}, [jokes.length])
```

- 使用 `while` 循环确保新索引与当前索引不同
- 除非笑话数量为 1，否则必然产生不同的索引

### 动画状态一致性

#### 问题

组件卸载时，如果动画状态不一致会导致异常。

#### 解决方案

1. **使用 `AnimatePresence` 的 `mode="wait"`**
```tsx
<AnimatePresence mode="wait" custom={direction}>
```

2. **通过 `custom` 属性传递方向**
```tsx
<motion.div custom={direction} variants={variants}>
```

3. **确保方向状态与动画同步更新**
```typescript
setDirection(1)  // 先更新方向
setCurrentIndex(prev => (prev + 1) % jokes.length)  // 再更新索引
```

---

## 版本历史

### v5.7.0 (当前版本)

**发布日期**: 2024年

**更新内容**:

- 优化随机算法，避免连续出现相同笑话
- 改进动画状态管理
- 完善水合错误预防机制
- 更新依赖包版本

**文件更新**:

| 文件 | 新版本 |
|-----|-------|
| app/page.tsx | v5.7.0 |
| app/layout.tsx | v5.7.0 |

### v5.3.2

**更新内容**:

- 主题切换组件优化
- 添加水合错误预防

**文件更新**:

| 文件 | 版本 |
|-----|------|
| components/theme-toggle.tsx | v5.3.2 |

### v5.0.0

**更新内容**:

- 笑话数据扩展至 1000+ 条
- 重构数据管理

**文件更新**:

| 文件 | 版本 |
|-----|------|
| lib/jokes-data.ts | v5.0.0 |

### v4.0.0

**更新内容**:

- 引入 Motion 动画库
- 完全重写动画系统
- 添加滑动切换功能

**文件更新**:

| 文件 | 版本 |
|-----|------|
| components/joke-card.tsx | v4.0.0 |
| components/theme-provider.tsx | v4.0.0 |

---

## 附录

### 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Motion 文档](https://motion.dev/docs)
- [next-themes 文档](https://github.com/pacocoursey/next-themes)
- [OpenSpec 规范](https://openspec.dev/)

### 许可证

本项目为私有项目，版本 0.1.0。

---

*本文档最后更新于 2024 年，符合 OpenSpec 规范 v1.0*
