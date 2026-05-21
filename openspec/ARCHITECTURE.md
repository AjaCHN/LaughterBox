# LaughterBox 架构设计文档

## 概述

本文档详细描述了 LaughterBox 项目的架构设计，包括前端架构、技术选型、状态管理方案以及性能优化策略。

## 技术架构

### 前端框架架构

```
Next.js 15 (App Router)
    │
    ├── React 19
    │   ├── 组件系统
    │   ├── Hooks (useState, useEffect, useCallback)
    │   └── Context (next-themes)
    │
    └── TypeScript 5.9
        ├── 类型系统
        ├── 接口定义
        └── 编译检查
```

### Next.js App Router 架构

```
app/
├── layout.tsx          # 根布局
├── page.tsx           # 首页（主应用）
├── globals.css         # 全局样式
└── metadata.json       # 元数据

components/
├── Page (app/page.tsx)
│   ├── Header
│   ├── Main Content
│   │   ├── Joke Viewer
│   │   │   └── Animated Joke Card
│   │   └── Navigation Controls
│   └── ThemeProvider
│       └── ThemeToggle
```

## 核心组件设计

### 页面组件 (Page Component)

#### 组件结构

```typescript
// app/page.tsx
export default function Page() {
  // 状态管理
  const [jokes] = useState<string[]>(JOKES_DATA)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [direction, setDirection] = useState(0)

  // 回调函数
  const handleRandom = useCallback(() => { /* ... */ }, [jokes.length])
  const handleNext = useCallback(() => { /* ... */ }, [jokes.length])
  const handlePrev = useCallback(() => { /* ... */ }, [jokes.length])

  // 生命周期
  useEffect(() => { /* 初始化逻辑 */ }, [])

  // 渲染
  return (
    <div>
      <header>...</header>
      <main>
        <AnimatePresence>
          <motion.div>...</motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
```

#### 状态管理策略

| 状态 | 类型 | 管理方式 | 说明 |
|-----|------|---------|------|
| jokes | string[] | useState | 笑话数据，只读 |
| currentIndex | number | useState | 当前笑话索引 |
| mounted | boolean | useState | 挂载状态，防抖合错误 |
| direction | number | useState | 动画方向控制 |

### 主题系统架构

```
ThemeProvider (components/theme-provider.tsx)
    │
    ├── next-themes
    │   ├── attribute: "class"
    │   ├── defaultTheme: "system"
    │   └── enableSystem: true
    │
    └── ThemeToggle (components/theme-toggle.tsx)
        ├── Sun Icon (浅色模式)
        └── Moon Icon (深色模式)
```

## 数据流设计

### 笑话数据流

```
JOKES_DATA (lib/jokes-data.ts)
    ↓
Page Component (app/page.tsx)
    ↓
useState: jokes
    ↓
Current Joke: jokes[currentIndex]
    ↓
motion.div (Animated)
    ↓
Render: 笑话文本 + 装饰元素
```

### 状态更新流程

#### 随机切换

```typescript
用户点击随机按钮
    ↓
handleRandom() 被调用
    ↓
setDirection(0) - 设置为随机模式（无滑动动画）
    ↓
setCurrentIndex(prev => {
  let nextIndex = prev
  while (nextIndex === prev) {
    nextIndex = Math.floor(Math.random() * jokes.length)
  }
  return nextIndex
})
    ↓
触发重新渲染
    ↓
motion.div 检测到 key 变化
    ↓
执行动画 (initial → animate)
```

#### 顺序切换

```typescript
用户滑动卡片
    ↓
onDragEnd 事件触发
    ↓
检测 offset.x 值
    ↓
调用 handleNext() 或 handlePrev()
    ↓
setDirection(1) 或 setDirection(-1)
    ↓
setCurrentIndex 更新索引
    ↓
触发重新渲染和动画
```

## 动画系统架构

### Motion 配置

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
  duration: 0.25,
  ease: "easeInOut"
}
```

### 动画状态机

```
┌─────────────┐
│   Initial   │ (初始状态)
└──────┬──────┘
       │ key 变化
       ↓
┌─────────────┐
│   Animate   │ (执行动画)
└──────┬──────┘
       │ 动画完成
       ↓
┌─────────────┐
│    Exit     │ (退出动画)
└─────────────┘
```

## PWA 架构

### Service Worker 策略

```
生产构建
    ↓
@ducanh2912/next-pwa
    ↓
生成 Service Worker (sw.js)
    ↓
注册到 public/ 目录
    ↓
浏览器安装 PWA 时自动注册
```

### 缓存策略

- **预缓存**: Next.js 生成的静态资源
- **运行时缓存**: 动态内容
- **离线支持**: 缓存策略由 PWA 库管理

## 性能优化策略

### 1. 代码分割

```typescript
// 动态导入非首屏组件
const JokeCard = dynamic(() => import('@/components/joke-card'), {
  loading: () => <LoadingSkeleton />
})
```

### 2. 静态生成

```typescript
// app/page.tsx (服务端组件)
export default function Page() {
  // 默认静态生成
}
```

### 3. 图片优化

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    }
  ]
}
```

### 4. 字体优化

```typescript
// app/layout.tsx
const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap' // 自动优化
})
```

## 错误处理架构

### 水合错误预防

```typescript
// 1. 服务端和客户端渲染不同
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true) // 仅在客户端执行
}, [])

// 2. 条件渲染
{mounted ? <ActualContent /> : <Placeholder />}

// 3. 抑制警告
<html suppressHydrationWarning>
```

### 边界情况处理

```typescript
// 空数据处理
if (jokes.length === 0) {
  return <div>暂无笑话</div>
}

// 单条笑话
if (jokes.length === 1) {
  // 禁用随机按钮
  return <button disabled>...</button>
}

// 循环索引
const nextIndex = (currentIndex + 1) % jokes.length
const prevIndex = (currentIndex - 1 + jokes.length) % jokes.length
```

## 目录组织

```
/workspace/
├── app/
│   ├── layout.tsx          # 根布局，包含字体和主题配置
│   ├── page.tsx            # 主页面，包含核心业务逻辑
│   └── globals.css         # 全局样式
│
├── components/
│   ├── theme-provider.tsx  # 主题上下文提供者
│   ├── theme-toggle.tsx    # 主题切换按钮
│   └── joke-card.tsx       # 笑话卡片组件
│
├── lib/
│   ├── jokes-data.ts       # 笑话数据
│   └── utils.ts            # 工具函数
│
└── hooks/
    └── use-mobile.ts       # 移动设备检测
```

## 扩展性设计

### 组件扩展

```typescript
// 添加新组件
interface JokeCardProps {
  content: string
  index: number
  onCopy?: () => void
}

// Hooks 扩展
const useJokes = () => {
  const [jokes] = useState(JOKES_DATA)
  const [currentIndex, setCurrentIndex] = useState(0)
  // ...
  return { jokes, currentIndex, setCurrentIndex }
}
```

### 数据源扩展

```typescript
// 从 API 加载
const useJokesFromAPI = () => {
  const [jokes, setJokes] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/jokes')
      .then(res => res.json())
      .then(data => setJokes(data))
  }, [])

  return jokes
}
```

---

*本文档为 LaughterBox 项目架构设计参考文档*
