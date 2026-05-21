# LaughterBox 部署指南

## 概述

本指南提供了将 LaughterBox 项目部署到 **Vercel** 和 **腾讯云 EdgeOne Pages** 的详细步骤和常见问题解决方案。

---

## 一、部署到 Vercel

### 1.1 自动部署 (推荐)

#### 步骤 1: 连接 GitHub 仓库
1. 访问 [Vercel 官网](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Import Project"，选择 LaughterBox 仓库
4. 导入项目

#### 步骤 2: 配置部署设置
Vercel 会自动检测到这是一个 Next.js 项目。在项目设置页面：

- **Framework Preset**: 选择 `Next.js`
- **Root Directory**: 使用默认 (项目根目录)
- **Environment Variables**: 可在项目设置中添加
- **Build Command**: `npm run build` (自动检测)
- **Output Directory**: `.next` (自动检测)

#### 步骤 3: 设置环境变量
在 Vercel 项目设置 → Environment Variables 中添加：
```
NODE_ENV=production
```

#### 步骤 4: 部署
点击 "Deploy" 按钮，等待 2-5 分钟部署完成。

---

### 1.2 Vercel 常见问题解决

#### 问题 1: 构建失败
**症状**: 构建过程中出现错误
**解决方法**:
```bash
# 1. 确保所有依赖已正确安装
npm install

# 2. 本地运行构建测试
npm run build

# 3. 检查是否有类型错误
npm run lint
```

#### 问题 2: Service Worker 加载失败
**症状**: PWA 功能不工作，浏览器控制台报错
**解决方法**:
1. 确保 [vercel.json](file:///workspace/vercel.json#L28) 配置正确
2. 在 Vercel 项目设置中确认头部设置已生效
3. 检查 HTTPS 是否启用（Service Worker 需要 HTTPS）

#### 问题 3: 图片加载失败
**症状**: `/public` 目录下的图标无法加载
**解决方法**:
1. 检查 [next.config.ts](file:///workspace/next.config.ts#L21) 中的 `remotePatterns` 配置
2. 确认静态资源已正确部署

---

## 二、部署到腾讯云 EdgeOne Pages

### 2.1 创建项目

#### 步骤 1: 登录 EdgeOne 控制台
1. 访问 [腾讯云 EdgeOne](https://cloud.tencent.com/product/edgeone)
2. 进入控制台
3. 点击 "新建应用"

#### 步骤 2: 导入代码
- **方式一**: 连接 GitHub/Gitee 仓库（推荐）
- **方式二**: 上传代码包

#### 步骤 3: 配置项目
在项目设置页面配置：

- **框架**: Next.js
- **构建命令**: `npm run build`
- **输出目录**: `.next`
- **Node 版本**: 18.x 或更高

---

### 2.2 配置环境变量
在 EdgeOne Pages 项目设置中添加：
```
NODE_ENV=production
EDGEONE=1
```

---

### 2.3 EdgeOne Pages 常见问题

#### 问题 1: 构建超时
**症状**: 构建过程超时而失败
**解决方法**:
1. 在项目设置中增加构建超时时间
2. 优化构建过程，移除不必要的依赖

#### 问题 2: 页面显示 404
**症状**: 部分页面或资源加载失败
**解决方法**:
1. 检查 [edgeone.config.json](file:///workspace/edgeone.config.json#L8) 中的路由配置
2. 确保 App Router 结构正确
3. 确认所有静态资源已正确打包

#### 问题 3: PWA 离线访问不可用
**症状**: 离线时无法访问应用
**解决方法**:
1. 确认 HTTPS 已启用
2. 检查 manifest.json 文件可访问
3. 在 EdgeOne 缓存规则中设置 sw.js 的缓存策略

---

## 三、通用部署建议

### 3.1 预部署检查清单
部署前请确保：

- [ ] 所有依赖在 package-lock.json 中锁定
- [ ] 本地构建测试通过 (`npm run build`)
- [ ] 类型检查通过 (`npm run lint`)
- [ ] 敏感信息未提交（.env 文件在 .gitignore 中）
- [ ] 图标资源已正确放置在 public 目录

### 3.2 性能优化建议

#### 图像优化
```typescript
// next.config.ts
images: {
  formats: ['image/webp'],
  deviceSizes: [360, 480, 640, 750, 828, 1080],
}
```

#### 代码分割
确保页面组件正确分割，避免过大的 bundle。

#### 缓存策略
配置静态资源的长期缓存：
- `/static/*`: max-age=31536000
- `/sw.js`: no-cache

### 3.3 安全建议

1. **启用 HTTPS**: 所有部署平台都应启用强制 HTTPS
2. **配置安全头**: XSS、CSP 等头部
3. **监控访问日志**: 及时发现异常请求

---

## 四、故障排查步骤

### 步骤 1: 检查构建日志
- **Vercel**: 在项目部署页面查看 Build Logs
- **EdgeOne**: 在构建记录中查看详细日志

### 步骤 2: 本地复现问题
```bash
# 1. 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 2. 运行生产构建
npm run build

# 3. 启动生产服务器
npm run start
```

### 步骤 3: 调试网络请求
使用浏览器开发者工具：
1. Network 标签检查请求状态
2. Application → Service Workers 检查 PWA 状态
3. Console 查看错误信息

---

## 五、环境变量参考

| 变量名 | 说明 | 建议值 |
|--------|------|--------|
| NODE_ENV | 运行环境 | production |
| VERCEL | Vercel 平台标识 | 自动设置 |
| EDGEONE | EdgeOne 平台标识 | 手动设置为 `1` |
| DISABLE_HMR | 禁用热重载 | `true` (仅在 AI Studio 环境) |

---

## 六、联系支持

如遇到无法解决的问题：
- **Vercel**: 访问 https://vercel.com/help
- **EdgeOne Pages**: 查看腾讯云官方文档

---

*最后更新: 2026-05-21*
