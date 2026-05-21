# LaughterBox 开发指南

## 1. 概述

本文档为 LaughterBox 项目的开发者提供完整的开发指南，包括环境设置、代码规范、开发流程、调试技巧、性能优化、测试指南和 Git 工作流。

## 2. 环境设置

### 2.1 前置要求

| 工具 | 最低版本 | 推荐版本 |
|-----|---------|---------|
| Node.js | 18.17.0 | 20.x 或更高 |
| npm | 9.0.0 | 10.x 或更高 |
| Git | 最新 | 最新 |

### 2.2 安装步骤

```bash
# 1. 克隆项目仓库
git clone <repository-url>
cd laughterbox

# 2. 安装项目依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 2.3 开发服务器

```bash
npm run dev
# 访问地址: http://localhost:3000
```

### 2.4 项目脚本

| 脚本 | 说明 |
|-----|------|
| npm run dev | 启动开发服务器 |
| npm run build | 构建生产版本 |
| npm run start | 启动生产服务器 |
| npm run lint | 运行 ESLint 检查 |

### 2.5 代码检查

```bash
# ESLint 检查
npm run lint

# TypeScript 类型检查（通过 build）
npm run build
```

---

## 3. 代码规范

### 3.1 TypeScript 规范

#### 3.1.1 类型定义

```typescript
// ✅ 好的实践：使用接口定义组件 Props
interface JokeCardProps {
  content: string;
  index: number;
}

// ✅ 明确函数返回类型
function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

// ✅ 使用泛型
const [jokes, setJokes] = useState<string[]>(JOKES_DATA);
```

#### 3.1.2 避免类型滥用

```typescript
// ❌ 不推荐：过度使用 any
function handleData(data: any) { /* ... */ }

// ✅ 推荐：使用 unknown 或具体类型
function handleData(data: unknown) {
  if (typeof data === 'string') {
    console.log(data);
  }
}
```

### 3.2 React 组件规范

#### 3.2.1 组件命名

```typescript
// 文件命名：PascalCase.tsx
// 组件名：PascalCase
export function ThemeToggle() { /* ... */ }
export default function Page() { /* ... */ }
```

#### 3.2.2 Hooks 使用规范

```typescript
// ❌ 错误：在条件语句中使用 Hook
function Component({ showToggle }) {
  if (showToggle) {
    const [state, setState] = useState(); // 错误
  }
  // ...
}

// ✅ 正确：在组件顶部调用所有 Hook
function Component({ showToggle }) {
  const [state, setState] = useState(); // 正确
  // ...
}

// ✅ 使用 useCallback 优化
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

#### 3.2.3 客户端组件标记

```tsx
// ✅ 客户端组件使用 "use client" 标记
"use client";

import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

### 3.3 Tailwind CSS 规范

#### 3.3.1 类名排序

```tsx
// ✅ 推荐：按功能分组排序
<button className="
  inline-flex          /* 显示属性 */
  items-center        /* 布局属性 */
  justify-center      /* 对齐属性 */
  h-9 w-9            /* 尺寸 */
  rounded-md          /* 边框和圆角 */
  bg-white            /* 背景 */
  text-neutral-900    /* 文字颜色 */
  transition-colors    /* 过渡 */
  hover:bg-neutral-100 /* 悬停状态 */
  dark:bg-neutral-950 /* 深色模式 */
  dark:text-neutral-50
">
  内容
</button>
```

#### 3.3.2 响应式设计

```tsx
// ✅ 推荐：移动优先，渐进增强
<div className="
  px-4 py-2          /* 移动端 */
  md:px-8 md:py-3    /* 平板 */
  lg:px-12           /* 桌面 */
">
  内容
</div>
```

#### 3.3.3 深色模式

```tsx
// ✅ 推荐：使用 dark: 前缀
<div className="bg-white dark:bg-neutral-900">
  内容
</div>

// ❌ 不推荐：重复定义颜色
<div className="bg-white bg-neutral-900">
  内容
</div>
```

### 3.4 文件组织规范

#### 3.4.1 目录结构

```
components/
├── ui/              # 基础 UI 组件
├── features/        # 业务功能组件
└── layout/          # 布局组件

hooks/
├── useTheme.ts      # 主题相关 Hook
└── useMobile.ts     # 设备检测 Hook

lib/
├── utils.ts         # 通用工具函数
└── constants.ts     # 常量定义
```

#### 3.4.2 导入顺序

```typescript
// 1. React 核心
import { useState, useEffect } from "react";

// 2. 外部库
import { motion } from "motion/react";
import { useTheme } from "next-themes";

// 3. 内部组件
import { ThemeToggle } from "@/components/theme-toggle";

// 4. 工具函数
import { cn } from "@/lib/utils";

// 5. 类型定义
import type { JokeCardProps } from "@/types";
```

---

## 4. 开发流程

### 4.1 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/feature-name

# 2. 实现功能
# ... 编辑代码 ...

# 3. 本地测试
npm run dev

# 4. 代码检查
npm run lint

# 5. 提交代码
git add .
git commit -m "feat: add new feature"

# 6. 推送到远程仓库
git push origin feature/feature-name
```

### 4.2 Bug 修复流程

```bash
# 1. 创建修复分支
git checkout -b fix/bug-description

# 2. 定位问题
# ... 调试代码 ...

# 3. 修复 Bug
# ... 编辑代码 ...

# 4. 验证修复
npm run dev

# 5. 提交修复
git add .
git commit -m "fix: resolve hydration error"

# 6. 推送并创建 PR
git push origin fix/bug-description
```

### 4.3 代码审查检查清单

提交代码前请检查：

- [ ] 代码符合 TypeScript 规范
- [ ] 组件 Props 接口定义完整
- [ ] 错误边界处理完善
- [ ] 响应式设计适配
- [ ] 深色模式支持
- [ ] ESLint 检查通过
- [ ] 无 console.error（调试用的需移除）

---

## 5. 调试技巧

### 5.1 React DevTools

```bash
# 安装 React DevTools 浏览器扩展
# https://react.dev/learn/react-developer-tools
```

使用技巧：
- 检查组件层级结构
- 查看 props 和 state 值
- 分析组件渲染性能
- 识别不必要的重渲染

### 5.2 Next.js DevTools

```bash
# 访问：http://localhost:3000/_next
```

功能：
- 分析构建产物
- 查看路由信息
- 调试中间件
- 检查水合错误

### 5.3 Motion DevTools

```typescript
// 启用 Motion 调试
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// 查看动画值
const x = useMotionValue(0);
console.log("x:", x.get());
```

### 5.4 常见问题调试

#### 5.4.1 水合错误

**问题**：服务端和客户端渲染不一致

**解决方案**：

```typescript
// 使用 mounted 状态
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

return mounted ? <ActualComponent /> : <Placeholder />;
```

#### 5.4.2 动画异常

**问题**：动画状态不一致

**解决方案**：

```typescript
// 使用 key 属性确保唯一性
<motion.div key={currentIndex} custom={direction}>
  内容
</motion.div>

// 确保 direction 先于 index 更新
setDirection(1);
setCurrentIndex(prev => prev + 1);
```

#### 5.4.3 样式问题

**问题**：深色模式样式不生效

**解决方案**：
- 检查 `tailwind.config.ts` 的 darkMode 配置
- 确保使用 `dark:` 前缀
- 确认 ThemeProvider 正确设置

---

## 6. 性能优化

### 6.1 组件优化

```typescript
// 使用 React.memo 避免不必要的重渲染
const JokeCard = React.memo(({ content, index }: JokeCardProps) => {
  return <div>{content}</div>;
});

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 使用 useCallback 缓存回调函数
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

### 6.2 图片优化

```typescript
// 使用 Next.js Image 组件
import Image from "next/image";

<Image
  src="/icon.svg"
  alt="App Icon"
  width={192}
  height={192}
/>
```

### 6.3 字体优化

```typescript
// 使用 next/font 自动优化字体
import { Noto_Serif_SC } from "next/font/google";

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// 在布局中使用
<body className={notoSerif.variable}>
```

### 6.4 代码分割

```typescript
// 按需加载组件
const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  loading: () => <LoadingSkeleton />,
});
```

---

## 7. 测试指南

### 7.1 手动测试清单

#### 7.1.1 功能测试

- [ ] 页面加载显示随机笑话
- [ ] 点击随机按钮切换笑话
- [ ] 左右滑动切换笑话
- [ ] 滑动方向正确（左右滑对应上下条）
- [ ] 笑话列表循环切换

#### 7.1.2 主题测试

- [ ] 浅色模式正常显示
- [ ] 深色模式正常显示
- [ ] 主题切换无闪烁
- [ ] 系统主题跟随
- [ ] 刷新后主题保持

#### 7.1.3 响应式测试

- [ ] 手机竖屏 (375px)
- [ ] 手机横屏 (812px)
- [ ] 平板 (768px)
- [ ] 桌面 (1280px)
- [ ] 大屏 (1920px)

#### 7.1.4 PWA 测试

- [ ] 可添加到主屏幕
- [ ] 离线可访问
- [ ] 启动画面正常
- [ ] 图标显示正确

---

## 8. Git 工作流

### 8.1 提交信息规范

#### 8.1.1 提交格式

```
<类型>(<范围>): <描述>

[可选正文]

[可选页脚]
```

#### 8.1.2 类型标识

| 类型 | 描述 | 示例 |
|-----|------|------|
| feat | 新功能 | `feat(jokes): add random joke display` |
| fix | Bug 修复 | `fix(hydration): resolve SSR mismatch` |
| docs | 文档更新 | `docs: update README` |
| style | 代码格式 | `style: format with Prettier` |
| refactor | 重构 | `refactor: extract theme logic` |
| perf | 性能优化 | `perf: optimize animation` |
| test | 测试相关 | `test: add component tests` |
| chore | 构建或辅助 | `chore: update dependencies` |

#### 8.1.3 示例

```bash
# ✅ 好的提交信息
git commit -m "feat(joke): add swipe gesture navigation

- Implement horizontal drag detection
- Add threshold-based navigation trigger
- Support circular joke list navigation"

git commit -m "fix(hydration): prevent theme toggle mismatch

Added mounted state to delay theme-dependent rendering"

# ❌ 坏的提交信息
git commit -m "fix stuff"
git commit -m "update"
git commit -m "WIP"
```

### 8.2 分支命名规范

```bash
feature/feature-name      # 新功能
fix/bug-description      # Bug 修复
docs/update-readme       # 文档更新
refactor/improve-code    # 代码重构
```

### 8.3 发布流程

```bash
# 1. 从 main 创建发布分支
git checkout -b release/v5.8.0

# 2. 更新版本号
# 修改 package.json、CHANGELOG.md 等

# 3. 测试验证
npm run build
npm run start

# 4. 合并到 main
git checkout main
git merge release/v5.8.0

# 5. 打标签
git tag -a v5.8.0 -m "Release version 5.8.0"

# 6. 删除发布分支
git branch -d release/v5.8.0
```

---

## 9. 常用命令速查

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码质量
npm run lint         # 运行 ESLint
npm run clean        # 清理 .next 目录

# Git
git status           # 查看状态
git log --oneline    # 查看提交历史
git diff             # 查看更改
```

---

## 10. 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Motion 文档](https://motion.dev/docs)

---

*本文档遵循 OpenSpec 规范 v1.0*
