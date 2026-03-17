# LaughterBox 技术规范 (OpenSpec)

## 1. 核心功能
- **随机笑话展示**: 应用加载时随机显示一条笑话，通过“换一个”按钮随机切换。
- **滑动切换**: 移动端支持左右滑动切换上一篇/下一篇笑话，并伴有水平滑动动画。
- **深色模式**: 支持系统级深色/浅色模式无缝切换。
- **PWA 支持**: 支持渐进式 Web 应用，可安装到主屏幕。

## 2. 架构设计
- **前端框架**: Next.js 15 (App Router)
- **UI 库**: React 19, Tailwind CSS 4, Lucide React
- **动画**: Motion (Framer Motion)
- **状态管理**: React Hooks (`useState`, `useEffect`, `useCallback`)

## 3. 关键组件
- `app/page.tsx`: 主页面，负责笑话数据的随机抽取、状态维护、滑动事件处理以及核心 UI 渲染。
- `components/theme-toggle.tsx`: 主题切换组件，利用 `next-themes` 实现。
- `lib/jokes-data.ts`: 静态笑话数据源，包含 1000+ 条短篇笑话。

## 4. 鲁棒性设计
- **空数据处理**: 在 `JOKES_DATA` 为空时，页面会安全降级并显示“暂无笑话”，避免索引越界或渲染崩溃。
- **水合错误预防**: 使用 `mounted` 状态延迟随机索引的计算，确保服务端与客户端初次渲染一致。
- **随机算法优化**: `handleRandom` 确保下一次随机索引与当前索引不同，避免连续出现相同的笑话。
- **动画状态一致性**: 使用 `AnimatePresence` 的 `custom` 属性传递动画方向，避免组件卸载时状态过期导致的动画异常。
