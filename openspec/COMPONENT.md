# LaughterBox 组件规范文档

## 概述

本文档定义了 LaughterBox 项目中所有组件的设计规范、接口定义和使用方式。

## 组件清单

| 组件名称 | 文件路径 | 描述 | 状态 |
|---------|---------|------|------|
| Page | app/page.tsx | 主页面组件 | v5.7.0 |
| ThemeProvider | components/theme-provider.tsx | 主题上下文提供者 | v4.0.0 |
| ThemeToggle | components/theme-toggle.tsx | 主题切换按钮 | v5.3.2 |
| JokeCard | components/joke-card.tsx | 笑话卡片组件 | v4.0.0 |

---

## Page 组件

### 基本信息

- **文件路径**: `app/page.tsx`
- **版本**: v5.7.0
- **类型**: 客户端组件 (`"use client"`)
- **导出方式**: 默认导出

### 功能描述

主页面组件，负责笑话数据的随机抽取、状态维护、滑动事件处理以及核心 UI 渲染。

### 接口定义

```typescript
// 无 props 接口（使用内部状态）
export default function Page()
```

### 状态管理

```typescript
// 笑话数据
const [jokes] = useState<string[]>(JOKES_DATA)

// 当前笑话索引
const [currentIndex, setCurrentIndex] = useState(0)

// 客户端挂载状态
const [mounted, setMounted] = useState(false)

// 动画方向 (-1: 左, 0: 随机, 1: 右)
const [direction, setDirection] = useState(0)
```

### 回调函数

#### handleRandom

```typescript
const handleRandom = useCallback(() => {
  if (jokes.length <= 1) return
  setDirection(0)
  setCurrentIndex(prev => {
    let nextIndex = prev
    while (nextIndex === prev) {
      nextIndex = Math.floor(Math.random() * jokes.length)
    }
    return nextIndex
  })
}, [jokes.length])
```

**功能**: 随机切换到不同的笑话

**参数**: 无

**返回值**: void

**触发条件**: 点击随机按钮

**边界条件**: 当笑话数量 ≤ 1 时不执行任何操作

#### handleNext

```typescript
const handleNext = useCallback(() => {
  if (jokes.length <= 1) return
  setDirection(1)
  setCurrentIndex(prev => (prev + 1) % jokes.length)
}, [jokes.length])
```

**功能**: 切换到下一条笑话（循环）

**参数**: 无

**返回值**: void

**触发条件**: 左滑超过 50px

#### handlePrev

```typescript
const handlePrev = useCallback(() => {
  if (jokes.length <= 1) return
  setDirection(-1)
  setCurrentIndex(prev => (prev - 1 + jokes.length) % jokes.length)
}, [jokes.length])
```

**功能**: 切换到上一条笑话（循环）

**参数**: 无

**返回值**: void

**触发条件**: 右滑超过 50px

### 生命周期

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setMounted(true)
    if (JOKES_DATA.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * JOKES_DATA.length))
    } else {
      setCurrentIndex(0)
    }
  }, 0)
  return () => clearTimeout(timer)
}, [])
```

**执行时机**: 组件挂载后延迟 0ms

**执行内容**:

1. 设置 `mounted = true`
2. 随机初始化笑话索引（如果数据不为空）

### 渲染结构

```tsx
<div id="page-wrapper">
  <header id="main-header">
    <div id="header-content">
      <div id="brand-logo">
        <Sparkles /> <h1>LaughterBox</h1>
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
            custom={direction}
            // ... 动画配置
          >
            <Quote /> <p>笑话文本</p> <div>索引</div>
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

### 动画配置

#### 变体定义

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

const transition = {
  duration: 0.25
}
```

#### 拖拽配置

```typescript
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.7}
  onDragEnd={(e, { offset }) => {
    if (offset.x < -50) handleNext()
    else if (offset.x > 50) handlePrev()
  }}
/>
```

### 使用示例

```tsx
import Page from '@/app/page'

export default function App() {
  return <Page />
}
```

---

## ThemeProvider 组件

### 基本信息

- **文件路径**: `components/theme-provider.tsx`
- **版本**: v4.0.0
- **类型**: 客户端组件
- **导出方式**: 命名导出

### 功能描述

主题上下文提供者，封装 `next-themes` 的 `ThemeProvider` 组件。

### 接口定义

```typescript
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>)
```

### Props

| Prop | 类型 | 必需 | 默认值 | 描述 |
|-----|------|------|--------|------|
| children | ReactNode | 是 | - | 子组件 |
| attribute | string | 否 | "class" | 主题应用方式 |
| defaultTheme | string | 否 | "system" | 默认主题 |
| enableSystem | boolean | 否 | true | 启用系统主题 |
| disableTransitionOnChange | boolean | 否 | false | 禁用过渡动画 |

### 配置参数

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

### 使用示例

```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function Layout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## ThemeToggle 组件

### 基本信息

- **文件路径**: `components/theme-toggle.tsx`
- **版本**: v5.3.2
- **类型**: 客户端组件
- **导出方式**: 命名导出

### 功能描述

主题切换按钮组件，提供浅色/深色模式切换功能。

### 接口定义

```typescript
export function ThemeToggle()
```

### 状态管理

```typescript
const { setTheme, resolvedTheme } = useTheme()
const [mounted, setMounted] = useState(false)
```

### 水合错误预防

```typescript
useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return (
    <div className="h-9 w-9 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950" />
  )
}
```

### 主题切换逻辑

```typescript
<button onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}>
  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</button>
```

### 样式规范

| 元素 | 浅色模式 | 深色模式 |
|-----|---------|---------|
| 按钮背景 | `bg-white` | `bg-neutral-950` |
| 按钮边框 | `border-neutral-200` | `border-neutral-800` |
| 图标颜色 | `text-neutral-900` | `text-neutral-50` |
| 悬停背景 | `hover:bg-neutral-100` | `dark:hover:bg-neutral-800` |
| 尺寸 (默认) | h-9 w-9 | - |
| 尺寸 (md) | h-10 w-10 | - |

### 辅助功能

```typescript
<span className="sr-only">Toggle theme</span>
```

### 使用示例

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

export default function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

---

## JokeCard 组件

### 基本信息

- **文件路径**: `components/joke-card.tsx`
- **版本**: v4.0.0
- **类型**: 客户端组件
- **导出方式**: 命名导出

### 功能描述

笑话卡片组件，支持复制到剪贴板功能。

### 接口定义

```typescript
interface JokeCardProps {
  content: string   // 笑话内容
  index: number     // 笑话索引
}

export function JokeCard({ content, index }: JokeCardProps)
```

### Props

| Prop | 类型 | 必需 | 描述 |
|-----|------|------|------|
| content | string | 是 | 笑话的完整文本内容 |
| index | number | 是 | 当前笑话的索引位置（从 0 开始） |

### 状态管理

```typescript
const [copied, setCopied] = useState(false)
```

### 核心功能

#### 复制到剪贴板

```typescript
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    console.error("Failed to copy text: ", err)
  }
}
```

**功能**: 将笑话内容复制到系统剪贴板

**反馈**: 复制成功后显示勾选图标，2 秒后恢复

### 渲染结构

```tsx
<motion.div
  id={`joke-card-item-${index}`}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.03 }}
  className="group relative flex flex-col justify-between ..."
>
  <p id={`joke-text-${index}`}>
    {content}
  </p>
  
  <div id={`joke-footer-${index}`}>
    <span id={`joke-index-${index}`}>
      #{index + 1}
    </span>
    <button
      id={`btn-copy-${index}`}
      onClick={handleCopy}
    >
      {copied ? <Check /> : <Copy />}
    </button>
  </div>
</motion.div>
```

### 动画配置

```typescript
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{
  duration: 0.3,
  delay: index * 0.03  // 每个卡片的入场延迟
}}
```

### 样式规范

| 元素 | 类名 | 描述 |
|-----|------|------|
| 卡片容器 | `rounded-lg border border-neutral-200 bg-white` | 圆角边框白色背景 |
| 卡片内容 | `p-4 shadow-sm` | 内边距和阴影 |
| 文本样式 | `text-2xl font-serif leading-snug` | 衬线体大字 |
| 页脚 | `mt-3 flex items-center justify-between` | 底部索引和操作 |
| 索引 | `text-xs font-mono text-neutral-400` | 等宽字体小字 |
| 复制按钮 | `inline-flex h-7 w-7 items-center justify-center rounded-full` | 圆形按钮 |

### 错误处理

```typescript
try {
  await navigator.clipboard.writeText(content)
  setCopied(true)
} catch (err) {
  console.error("Failed to copy text: ", err)
}
```

### 使用示例

```tsx
import { JokeCard } from '@/components/joke-card'
import { JOKES_DATA } from '@/lib/jokes-data'

export default function JokesList() {
  return (
    <div className="grid gap-4">
      {JOKES_DATA.map((joke, index) => (
        <JokeCard
          key={index}
          content={joke}
          index={index}
        />
      ))}
    </div>
  )
}
```

---

## 组件版本管理规范

### 版本号格式

```
主版本.次版本.修订号
```

### 版本升级规则

| 升级类型 | 触发条件 |
|---------|---------|
| 主版本 | 重大架构变更、API 不兼容 |
| 次版本 | 新增功能、组件接口扩展 |
| 修订号 | Bug 修复、文档更新、代码重构 |

### 版本标记位置

每个组件文件的第一行注释中标记版本号：

```typescript
// components/theme-toggle.tsx v5.3.2
```

---

## 组件设计原则

### 1. 单一职责原则

每个组件只负责一个功能领域：

- **Page**: 主页面逻辑和渲染
- **ThemeProvider**: 主题上下文管理
- **ThemeToggle**: 主题切换交互
- **JokeCard**: 单个笑话展示和操作

### 2. Props 接口化

```typescript
// 好的实践
interface JokeCardProps {
  content: string
  index: number
}

// 不推荐的实践
function JokeCard({ content, index, onClick, onCopy, showIndex, ... })
```

### 3. 状态提升

共享状态提升到最近的公共祖先：

```typescript
// ThemeToggle 需要访问主题状态
// → 提升到 ThemeProvider → Layout → RootLayout
```

### 4. 受控组件优先

```typescript
// 组件自己管理状态
const [copied, setCopied] = useState(false)

// 外部控制（必要时）
<JokeCard content={joke} index={index} />
```

### 5. 错误边界

```typescript
// 边界情况检查
if (jokes.length === 0) return <EmptyState />
if (!mounted) return <Skeleton />
```

---

## 附录

### 组件 ID 命名规范

| 组件 | ID 格式 | 示例 |
|-----|--------|------|
| Page | `{name}-wrapper` | `page-wrapper` |
| Header | `main-header` | `main-header` |
| Logo | `brand-logo` | `brand-logo` |
| Content | `main-content` | `main-content` |
| Joke Viewer | `joke-viewer-container` | `joke-viewer-container` |
| Joke Card | `joke-card-{index}` | `joke-card-0` |
| Random Button | `btn-random` | `btn-random` |
| Theme Toggle | `btn-theme-toggle` | `btn-theme-toggle` |
| Navigation | `nav-controls` | `nav-controls` |

---

*本文档为 LaughterBox 组件规范参考文档*
