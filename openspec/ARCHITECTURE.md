# LaughterBox 架构设计文档

## 1. 概述

本文档详细描述 LaughterBox 项目的技术架构设计，包括整体架构、技术选型决策、组件结构、数据流设计、性能优化策略等。

## 2. 整体架构

### 2.1 技术架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Next.js App Router (app/)              │   │
│  │  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │  layout.tsx │  │      page.tsx          │  │   │
│  │  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     组件层 (components/)                  │
│  ┌──────────────────┐  ┌───────────────────────┐        │
│  │ ThemeProvider    │  │ ThemeToggle           │        │
│  │ (主题上下文)     │  │ (主题切换按钮)         │        │
│  └──────────────────┘  └───────────────────────┘        │
│  ┌──────────────────┐                                   │
│  │ JokeCard         │ (备用组件)                          │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     逻辑层                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │         React Hooks & 状态管理                  │   │
│  │  - useState (jokes, currentIndex, mounted)    │   │
│  │  - useCallback (handleRandom, handleNext)     │   │
│  │  - useEffect (初始化逻辑)                      │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌──────────────────┐                                   │
│  │ use-mobile.ts    │ (设备检测 Hook)                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     数据层                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │            lib/jokes-data.ts (静态数据)         │   │
│  │            1012 条笑话                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              样式与动画层                                 │
│  ┌──────────────────────┐  ┌───────────────────────┐  │
│  │  Tailwind CSS        │  │  Motion (动画库)      │  │
│  └──────────────────────┘  └───────────────────────┘  │
│  ┌──────────────────────┐                              │
│  │  next-themes (主题)  │                              │
│  └──────────────────────┘                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              PWA 层 (@ducanh2912/next-pwa)               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Service Worker + Manifest + 离线缓存           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技术选型决策

| 技术选型 | 选择方案 | 选择理由 | 替代方案 |
|---------|---------|---------|---------|
| 框架 | Next.js 15 (App Router) | SSR/SSG 支持、App Router 新特性、优秀的开发体验 | Remix、Vite、Create React App |
| 语言 | TypeScript | 类型安全、更好的开发体验、减少运行时错误 | JavaScript |
| 样式 | Tailwind CSS 4 | 原子化 CSS、快速开发、优秀的开发工具支持 | CSS Modules、Styled Components、Emotion |
| 动画 | Motion (Framer Motion 新版本) | 强大的动画能力、与 React 深度集成、优秀的 API | CSS 动画、React Spring、GSAP |
| 主题 | next-themes | 开箱即用的深色模式支持、与 Tailwind 完美集成、水合错误预防 | 自定义主题实现 |
| PWA | @ducanh2912/next-pwa | Next.js 专用 PWA 库、配置简单、自动生成 Service Worker | next-pwa (旧版本)、Workbox |

## 3. 组件架构

### 3.1 组件树

```
RootLayout (app/layout.tsx)
├── ThemeProvider (components/theme-provider.tsx)
│   └── Page (app/page.tsx)
│       ├── header (导航栏)
│       │   ├── Sparkles 图标 (品牌标识)
│       │   ├── h1 (标题)
│       │   └── ThemeToggle (主题切换按钮)
│       └── main (主内容区)
│           ├── div (笑话查看器容器)
│           │   ├── AnimatePresence
│           │   │   └── motion.div (笑话卡片)
│           │   │       ├── Quote (左上角装饰)
│           │   │       ├── p (笑话文本)
│           │   │       └── div (索引指示器)
│           │   └── div (导航控制)
│           │       └── button (随机按钮)
│           │           └── Shuffle (图标)
└── 其他全局资源
```

### 3.2 组件职责分工

| 组件 | 文件 | 职责 | 类型 |
|-----|------|------|------|
| RootLayout | app/layout.tsx | 根布局、主题提供者、字体配置 | 服务端组件 |
| Page | app/page.tsx | 主页面、状态管理、核心业务逻辑、动画处理 | 客户端组件 |
| ThemeProvider | components/theme-provider.tsx | 主题上下文提供者、封装 next-themes | 客户端组件 |
| ThemeToggle | components/theme-toggle.tsx | 主题切换 UI、图标动画 | 客户端组件 |
| JokeCard | components/joke-card.tsx | 笑话卡片展示（备用组件） | 客户端组件 |

## 4. 状态管理

### 4.1 状态架构

本项目采用轻量级状态管理方案，主要使用 React 内置的 Hooks：

```typescript
// 主要状态（在 app/page.tsx 中）
const [jokes] = useState<string[]>(JOKES_DATA);      // 笑话数据（只读）
const [currentIndex, setCurrentIndex] = useState(0); // 当前笑话索引
const [mounted, setMounted] = useState(false);       // 客户端挂载标志
const [direction, setDirection] = useState(0);       // 动画方向

// 回调函数
const handleRandom = useCallback(() => {...});
const handleNext = useCallback(() => {...});
const handlePrev = useCallback(() => {...});
```

### 4.2 状态更新流程

#### 4.2.1 随机切换流程

```
用户点击随机按钮
    ↓
handleRandom() 执行
    ↓
setDirection(0) // 设置为随机模式
    ↓
setCurrentIndex(prev => {
  let nextIndex = prev;
  while (nextIndex === prev) {
    nextIndex = Math.floor(Math.random() * jokes.length);
  }
  return nextIndex;
})
    ↓
触发组件重新渲染
    ↓
AnimatePresence 检测 key 变化
    ↓
执行入场/退场动画
```

#### 4.2.2 滑动切换流程

```
用户拖拽笑话卡片
    ↓
onDragEnd 事件触发
    ↓
计算 offset.x 偏移量
    ↓
判断是否超过阈值 (50px)
    ↓
  ├─ offset.x < -50 → 调用 handleNext()
  └─ offset.x > 50 → 调用 handlePrev()
    ↓
setDirection(1) 或 setDirection(-1)
    ↓
setCurrentIndex 更新索引
    ↓
触发重新渲染和动画
```

## 5. 数据流设计

### 5.1 笑话数据流

```
┌─────────────────┐
│  JOKES_DATA     │ (lib/jokes-data.ts 静态数据)
└────────┬────────┘
         ↓
┌─────────────────┐
│   Page 组件     │ (useState 初始化数据)
│  const [jokes]  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ currentIndex    │ (通过 useState 管理)
└────────┬────────┘
         ↓
┌─────────────────┐
│ jokes[current]  │ (当前展示的笑话)
└────────┬────────┘
         ↓
┌─────────────────┐
│  motion.div     │ (AnimatePresence 包裹)
└────────┬────────┘
         ↓
┌─────────────────┐
│   渲染到 DOM    │
└─────────────────┘
```

### 5.2 主题数据流

```
┌─────────────────┐
│  用户系统主题   │ (浏览器/操作系统设置)
└────────┬────────┘
         ↓
┌─────────────────┐
│  next-themes    │ (ThemeProvider)
└────────┬────────┘
         ↓
┌─────────────────┐
│ useTheme() Hook │
└────────┬────────┘
         ↓
┌─────────────────┐
│  ThemeToggle    │ (读取 resolvedTheme)
└────────┬────────┘
         ↓
┌─────────────────┐
│  点击切换主题   │
│ setTheme()      │
└────────┬────────┘
         ↓
┌─────────────────┐
│  更新 HTML class│
└─────────────────┘
         ↓
┌─────────────────┐
│  Tailwind CSS   │ (dark: 前缀样式生效)
└─────────────────┘
```

## 6. 动画系统架构

### 6.1 Motion 配置

核心动画变体定义（在 app/page.tsx 中）：

```typescript
const variants = {
  initial: (dir: number) => ({
    opacity: 0,
    scale: 0.98,
    x: dir === 0 ? 0 : dir * 50, // 随机模式无水平位移
    y: dir === 0 ? 10 : 0,        // 随机模式有轻微垂直位移
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.98,
    x: dir === 0 ? 0 : dir * -50,
    y: dir === 0 ? -10 : 0,
  }),
};

const transition = {
  duration: 0.25,
  ease: "easeInOut",
};
```

### 6.2 动画状态机

```
┌────────────────┐      key 变化       ┌────────────────┐
│   Initial      │ ─────────────────→  │    Animate     │
│  (初始状态)     │                     │  (入场动画)     │
└────────────────┘                     └────────┬───────┘
                                                │
                                                │ 动画完成
                                                ↓
                                        ┌────────────────┐
                                        │     Exit       │
                                        │  (退场动画)     │
                                        └────────────────┘
```

### 6.3 拖拽交互配置

```typescript
<motion.div
  drag="x"                              // 启用水平拖拽
  dragConstraints={{ left: 0, right: 0 }} // 限制拖拽范围
  dragElastic={0.7}                    // 拖拽弹性系数
  onDragEnd={(e, { offset }) => {
    if (offset.x < -50) {
      handleNext();                   // 左滑超过 50px → 下一条
    } else if (offset.x > 50) {
      handlePrev();                   // 右滑超过 50px → 上一条
    }
  }}
/>
```

## 7. PWA 架构

### 7.1 PWA 配置概览

```
┌─────────────────────────────────────────────┐
│         @ducanh2912/next-pwa               │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ↓                     ↓
┌──────────────────┐  ┌──────────────────┐
│   Service Worker │  │   Manifest.json  │
│   (sw.js)        │  │   (public/)      │
└──────────┬───────┘  └──────────┬───────┘
           │                     │
           └──────────┬──────────┘
                      ↓
              ┌──────────────────┐
              │  离线缓存 &      │
              │  PWA 安装        │
              └──────────────────┘
```

### 7.2 Service Worker 策略

- **开发环境**：禁用 Service Worker（disable: true）
- **生产环境**：启用 Service Worker
- **预缓存**：Next.js 生成的静态资源
- **运行时缓存**：由 @ducanh2912/next-pwa 自动管理

## 8. 性能优化策略

### 8.1 代码优化

1. **静态生成**：利用 Next.js App Router 的静态生成能力
2. **组件懒加载**：使用 dynamic import（本项目当前未使用，但架构支持）
3. **Memoization**：使用 useCallback 缓存回调函数
4. **Tree Shaking**：Next.js 自动处理

### 8.2 资源优化

1. **字体优化**：使用 next/font 优化 Noto Serif SC 加载
2. **图片优化**：使用 Next.js Image 组件（本项目主要使用 SVG 图标）
3. **SVG 图标**：内联 SVG 减少网络请求
4. **CSS 优化**：Tailwind CSS 自动去重和压缩

### 8.3 构建优化

1. **独立构建**：output: 'standalone' 减少部署体积（非云平台）
2. **TypeScript 严格模式**：捕获潜在问题
3. **ESLint 检查**：保持代码质量

## 9. 鲁棒性设计

### 9.1 水合错误预防

**问题**：服务端和客户端渲染不一致导致的 React 水合错误。

**解决方案**：

1. **延迟初始化**：使用 mounted 状态
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  // 仅在客户端初始化随机索引
  setCurrentIndex(Math.floor(Math.random() * JOKES_DATA.length));
}, []);
```

2. **条件渲染**：仅在 mounted 为 true 时渲染依赖客户端的内容
```typescript
{mounted && <ActualContent />}
```

3. **抑制警告**：在根元素添加 suppressHydrationWarning
```tsx
<html lang="zh-CN" suppressHydrationWarning>
```

### 9.2 边界条件处理

| 边界条件 | 处理方式 |
|---------|---------|
| 笑话数据为空 | 显示"暂无笑话"提示文本 |
| 只有一条笑话 | 禁用随机切换和滑动功能 |
| 索引越界 | 使用取模运算实现循环 |
| 网络离线 | PWA Service Worker 提供离线支持 |

## 10. 扩展性设计

### 10.1 组件扩展

当前架构支持：
- 添加新的主题变体
- 扩展笑话卡片功能（收藏、分享等）
- 添加新的动画效果
- 引入新的 UI 组件

### 10.2 数据源扩展

当前使用静态数据，未来可扩展为：
- 从 API 动态获取笑话
- 支持分类筛选
- 添加搜索功能
- 用户提交笑话

### 10.3 功能扩展建议

1. **多语言支持**：添加国际化（i18n）
2. **用户账户**：用户登录、收藏管理
3. **社交分享**：分享到社交媒体
4. **数据同步**：云端同步用户设置

---

*本文档遵循 OpenSpec 规范 v1.0*
