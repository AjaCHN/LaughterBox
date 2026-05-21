# LaughterBox 项目规范

## 1. 项目概述

### 1.1 基本信息

| 项目属性 | 值 |
|---------|---|
| **项目名称** | LaughterBox（笑话大集合） |
| **当前版本** | v5.7.0 |
| **项目类型** | 渐进式 Web 应用（PWA） |
| **项目描述** | 极简设计的笑话展示应用，提供纯粹的阅读体验 |
| **主要语言** | 中文 |
| **开发团队** | Sut |
| **创建日期** | 2024 |
| **最后更新** | 2026-05-21 |

### 1.2 项目特点

- **极简设计**：专注内容，界面清爽无干扰
- **自适应布局**：针对手机、平板和桌面全面优化
- **深色模式**：支持系统级深色/浅色模式无缝切换
- **滑动导航**：支持左右滑动切换上一条/下一条笑话
- **随机展示**：点击按钮随机切换到不同笑话
- **PWA 支持**：可安装到主屏幕，支持离线访问
- **高鲁棒性**：完善的空数据处理和水合错误预防机制

### 1.3 受众

- 普通用户：寻求轻松娱乐体验的移动端用户
- 开发者：对 Next.js、PWA 开发感兴趣的开发者

---

## 2. 技术栈

### 2.1 核心框架

| 技术 | 版本 | 用途 |
|-----|------|-----|
| Next.js | 15.4.9 | 全栈 React 框架，使用 App Router |
| React | 19.2.1 | 用户界面库 |
| TypeScript | 5.9.3 | 类型安全的 JavaScript |

### 2.2 UI 和样式

| 技术 | 版本 | 用途 |
|-----|------|-----|
| Tailwind CSS | 4.1.11 | 原子化 CSS 框架 |
| Lucide React | 0.553.0 | 图标库 |

### 2.3 动画和交互

| 技术 | 版本 | 用途 |
|-----|------|-----|
| Motion | 12.23.24 | 动画库（Framer Motion 最新版本） |

### 2.4 主题管理

| 技术 | 版本 | 用途 |
|-----|------|-----|
| next-themes | 0.4.6 | 深色/浅色主题切换库 |

### 2.5 PWA 支持

| 技术 | 版本 | 用途 |
|-----|------|-----|
| @ducanh2912/next-pwa | 10.2.9 | Next.js PWA 集成 |

### 2.6 工具库

| 技术 | 版本 | 用途 |
|-----|------|-----|
| tailwind-merge | 3.3.1 | Tailwind 类名合并工具 |
| clsx | 2.1.1 | 条件类名工具 |
| class-variance-authority | 0.7.1 | 组件变体管理 |
| autoprefixer | 10.4.21 | CSS 自动前缀 |

---

## 3. 核心功能规范

### 3.1 随机笑话展示

**功能描述**：应用加载时随机选择笑话展示，点击随机按钮切换不同笑话。

**详细规范**：
- 初始加载时，延迟随机选择笑话（避免水合错误）
- 随机切换时确保与当前笑话不同
- 笑话文本居中显示，使用大字号衬线字体
- 显示当前笑话索引和总数（格式：`001 / 1012`）

**边界条件**：
- 笑话数据为空：显示"暂无笑话"提示
- 只有一条笑话：禁用随机切换功能

### 3.2 滑动导航

**功能描述**：移动端支持左右滑动切换上一条/下一条笑话。

**详细规范**：
- 水平拖拽检测，阈值设置为 50px
- 左滑超过阈值：切换到下一条笑话
- 右滑超过阈值：切换到上一条笑话
- 支持循环切换（最后一条→第一条）
- 伴随流畅的滑动动画效果

### 3.3 优雅排版

**功能描述**：大字号衬线字体，装饰性引号，提供沉浸式阅读体验。

**排版规范**：
- **字体**：Noto Serif SC（Google Fonts）
- **字号响应式**：
  - 移动端（sm）：text-2xl（~24px）
  - 平板（md）：text-3xl（~30px）
  - 桌面（lg）：text-4xl（~36px）
- **行高**：leading-snug（1.25）
- **字间距**：tracking-tight（-0.025em）
- **文本对齐**：居中（text-center）

**装饰元素**：
- 左上角装饰引号（旋转 180°，透明度 10%）
- 右下角装饰引号（正常方向，透明度 10%）
- 底部索引指示器，包含水平分隔线

### 3.4 深色模式

**功能描述**：支持系统级深色/浅色模式无缝切换。

**详细规范**：
- 使用 `next-themes` 管理主题状态
- 主题属性设置为 `class`（通过 CSS 类切换）
- 默认主题：`system`（跟随系统设置）
- 主题切换按钮：
  - 浅色模式：显示太阳图标
  - 深色模式：显示月亮图标
  - 图标切换带淡入淡出动画

**颜色方案**：
| 元素 | 浅色模式 | 深色模式 |
|-----|---------|---------|
| 背景色 | bg-neutral-50 (#fafafa) | bg-neutral-950 (#030303) |
| 文字色 | text-neutral-900 (#171717) | text-neutral-50 (#fafafa) |
| 卡片背景 | bg-white (#ffffff) | bg-neutral-900 (#171717) |
| 边框色 | border-neutral-200/50 | border-neutral-800/50 |

### 3.5 PWA 支持

**功能描述**：支持渐进式 Web 应用特性。

**配置规范**：
- **清单文件**：public/manifest.json
- **应用图标**：192x192px 和 512x512px SVG 图标
- **主题色**：#ffffff
- **显示模式**：standalone
- **Service Worker**：由 @ducanh2912/next-pwa 生成
- **离线支持**：生产环境启用 Service Worker

---

## 4. 目录结构

```
/workspace/
├── app/                          # Next.js App Router 目录
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局组件
│   ├── page.tsx                 # 主页面组件
│   └── metadata.json            # 应用元数据
│
├── components/                   # React 组件目录
│   ├── joke-card.tsx            # 笑话卡片组件（备用）
│   ├── theme-provider.tsx       # 主题提供者
│   └── theme-toggle.tsx         # 主题切换按钮
│
├── hooks/                        # 自定义 React Hooks
│   └── use-mobile.ts            # 移动设备检测 Hook
│
├── lib/                          # 工具函数和数据
│   ├── jokes-data.ts           # 笑话数据源（1012 条笑话）
│   └── utils.ts                # 通用工具函数
│
├── openspec/                     # OpenSpec 规范文档
│   ├── README.md               # 规范文档索引
│   ├── spec.md                 # 主规范文档（本文件）
│   ├── ARCHITECTURE.md         # 架构设计文档
│   ├── COMPONENT.md            # 组件规范文档
│   ├── DEVELOPMENT.md          # 开发指南
│   └── DEPLOYMENT.md           # 部署指南
│
├── public/                       # 静态资源目录
│   ├── icon-192x192.svg        # PWA 图标 192px
│   ├── icon-512x512.svg        # PWA 图标 512px
│   └── manifest.json            # PWA 清单文件
│
├── .eslintrc.json               # ESLint 配置
├── .gitignore                   # Git 忽略文件
├── CHANGELOG.md                # 版本更新日志
├── DEPLOYMENT_GUIDE.md         # 部署指南
├── LICENSE                     # 许可证
├── README.md                   # 项目说明（中文）
├── README_EN.md               # 项目说明（英文）
├── edgeone.config.json        # 腾讯云 EdgeOne 配置
├── eslint.config.mjs          # ESLint Flat Config
├── metadata.json              # 项目元数据
├── next.config.ts             # Next.js 配置
├── package.json               # 依赖管理
├── package-lock.json          # 依赖锁定文件
├── postcss.config.mjs         # PostCSS 配置
├── tailwind.config.ts         # Tailwind CSS 配置
├── tsconfig.json              # TypeScript 配置
└── vercel.json               # Vercel 部署配置
```

---

## 5. 组件架构规范

详见 [COMPONENT.md](./COMPONENT.md)

---

## 6. 架构设计规范

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 7. 开发规范

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 8. 部署规范

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 9. 版本历史

| 版本 | 日期 | 主要变更 |
|------|------|---------|
| v5.7.0 | 2026-05-21 | 优化随机算法，完善部署配置 |
| v5.3.2 | - | 主题切换组件优化，添加水合错误预防 |
| v5.0.0 | - | 笑话数据扩展至 1012 条 |
| v4.0.0 | - | 引入 Motion 动画库，完全重写动画系统 |
| v3.x | - | 添加滑动导航功能 |
| v2.x | - | 引入深色模式支持 |
| v1.x | - | 初始版本，基础笑话展示功能 |

---

## 10. 相关资源

### 10.1 内部文档

- [项目 README](../README.md)
- [CHANGELOG](../CHANGELOG.md)
- [DEPLOYMENT_GUIDE](../DEPLOYMENT_GUIDE.md)

### 10.2 外部链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Motion 文档](https://motion.dev/docs)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- [OpenSpec 规范](https://openspec.dev/)

---

*本文档遵循 OpenSpec 规范 v1.0*
