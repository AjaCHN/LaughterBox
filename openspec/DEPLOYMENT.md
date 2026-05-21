# LaughterBox 部署指南

## 1. 概述

本文档提供 LaughterBox 项目的完整部署指南，包括部署架构、构建配置、部署方式、性能优化、监控与日志、安全配置、备份与恢复以及故障排查。

## 2. 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                      CDN / 负载均衡                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js 独立服务器                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Node.js 运行时                             │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │          Next.js 应用                           │   │  │
│  │  │  - 静态页面生成 (SSG)                          │   │  │
│  │  │  - 服务端渲染 (SSR)                             │   │  │
│  │  │  - API 路由                                     │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Service Worker (PWA 离线支持)                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 部署前准备

### 3.1 环境要求

| 工具 | 最低版本 | 推荐版本 |
|-----|---------|---------|
| Node.js | 18.17.0 | 20.x 或更高 |
| npm | 9.0.0 | 10.x 或更高 |
| 操作系统 | 任意 | Linux, macOS, Windows |

### 3.2 依赖检查

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 验证项目依赖
npm list next react react-dom
```

---

## 4. 构建配置

### 4.1 Next.js 配置 (next.config.ts)

```typescript
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const isDeployingToVercel = process.env.VERCEL === "1";
const isDeployingToEdgeOne = process.env.EDGEONE === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 根据部署平台选择输出模式
  ...(isDeployingToVercel || isDeployingToEdgeOne
    ? {}
    : { output: "standalone" }),
  transpilePackages: ["motion"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
    // 对不同部署平台设置不同的优化器
    unoptimized: false,
  },
  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === "true") {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
```

### 4.2 关键配置说明

| 配置项 | 值 | 说明 |
|-----|------|-----|
| output | "standalone" | 输出独立部署包（非云平台） |
| reactStrictMode | true | 启用 React 严格模式 |
| transpilePackages | ["motion"] | 转译第三方包 |
| eslint.ignoreDuringBuilds | true | 构建时忽略 ESLint |
| typescript.ignoreBuildErrors | false | TypeScript 错误阻止构建 |

---

## 5. 环境变量

### 5.1 开发环境 (.env.local)

```bash
NODE_ENV=development
DISABLE_HMR=false
```

### 5.2 生产环境 (.env.production)

```bash
NODE_ENV=production
DISABLE_HMR=true
```

### 5.3 云平台特定环境变量

#### Vercel
```bash
# Vercel 自动设置这些变量
VERCEL=1
```

#### 腾讯云 EdgeOne
```bash
EDGEONE=1
```

### 5.4 运行时变量说明

| 变量名 | 类型 | 默认值 | 说明 |
|-------|------|--------|-----|
| NODE_ENV | string | development | 运行环境 |
| DISABLE_HMR | string | false | 禁用热模块替换 |
| PORT | number | 3000 | 服务端口 |
| HOSTNAME | string | localhost | 主机地址 |

---

## 6. 构建流程

### 6.1 安装依赖

```bash
npm ci
# 或者
npm install --production=false
```

### 6.2 构建应用

```bash
npm run build
```

### 6.3 构建产物

```
.next/
├── standalone/          # 独立部署包（仅 output: standalone 时）
│   ├── server.js        # Node.js 服务器
│   ├── package.json
│   └── .next/           # Next.js 资源
│
├── static/              # 静态资源
│   ├── _next/           # Next.js 静态文件
│   └── manifest.json    # PWA 清单
│
└── server/              # 服务端文件
    ├── app/
    └── pages/
```

### 6.4 启动服务器

```bash
# 开发环境
npm run dev

# 生产环境
npm run start

# 自定义端口
PORT=8080 npm run start
```

---

## 7. 部署方式

### 7.1 Vercel 部署（推荐）

#### 7.1.1 快速部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

#### 7.1.2 Vercel 配置 (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["hkg1"],
  "rewrites": [],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Content-Type",
          "value": "application/javascript; charset=utf-8"
        }
      ]
    }
  ]
}
```

#### 7.1.3 Vercel 自动配置

- **构建命令**：`npm run build`
- **输出目录**：`.next`
- **环境变量**：在 Vercel 控制台配置

### 7.2 腾讯云 EdgeOne Pages 部署

#### 7.2.1 配置文件 (edgeone.config.json)

```json
{
  "version": "1.0",
  "framework": "nextjs",
  "build": {
    "command": "npm run build",
    "outputDirectory": ".next"
  },
  "routes": [
    {
      "src": "/_next/static/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "headers": {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "X-XSS-Protection": "1; mode=block"
      }
    }
  ],
  "platform": {
    "framework": {
      "name": "nextjs",
      "version": "15"
    },
    "nodeVersion": "18.x"
  }
}
```

### 7.3 Docker 部署

#### 7.3.1 Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 复制构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
```

#### 7.3.2 Docker 命令

```bash
# 构建镜像
docker build -t laughterbox:latest .

# 运行容器
docker run -d -p 3000:3000 --name laughterbox-app laughterbox:latest

# 查看日志
docker logs -f laughterbox-app

# 停止容器
docker stop laughterbox-app

# 删除容器
docker rm laughterbox-app
```

### 7.4 传统服务器部署

```bash
# 1. 构建应用
npm run build

# 2. 安装生产依赖
npm ci --production

# 3. 复制到服务器
scp -r .next user@server:/path/to/app
scp -r public user@server:/path/to/app
scp package.json user@server:/path/to/app

# 4. 启动服务
ssh user@server
cd /path/to/app
NODE_ENV=production PORT=3000 node .next/standalone/server.js
```

### 7.5 PM2 进程管理

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start .next/standalone/server.js --name laughterbox

# 常用命令
pm2 list              # 查看进程列表
pm2 logs laughterbox  # 查看日志
pm2 restart laughterbox  # 重启
pm2 stop laughterbox    # 停止
pm2 delete laughterbox  # 删除
```

PM2 配置文件 (ecosystem.config.js)：

```javascript
module.exports = {
  apps: [{
    name: "laughterbox",
    script: ".next/standalone/server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    error_file: "./logs/error.log",
    out_file: "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z"
  }]
}
```

---

## 8. PWA 部署

### 8.1 Service Worker 生成

```bash
npm run build
```

生成文件：
```
public/
├── sw.js              # Service Worker
├── sw.js.map
├── workbox-*.js       # Workbox 运行时
└── manifest.json      # PWA 清单
```

### 8.2 PWA 配置 (manifest.json)

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

### 8.3 离线支持

- **预缓存**：Next.js 生成的静态资源自动缓存
- **运行时缓存**：可通过 Workbox 配置
- **注意**：Service Worker 需要 HTTPS 环境（localhost 除外）

---

## 9. 性能优化

### 9.1 构建优化

#### 9.1.1 分析构建体积

```bash
# 使用 @next/bundle-analyzer
npm install @next/bundle-analyzer
```

配置 next.config.ts：
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

运行分析：
```bash
ANALYZE=true npm run build
```

#### 9.1.2 优化策略

1. **代码分割**：Next.js 自动按路由分割
2. **Tree Shaking**：移除未使用的代码
3. **压缩**：生产构建自动压缩
4. **字体优化**：使用 `next/font` 自动优化

### 9.2 运行时优化

#### 9.2.1 缓存策略

| 资源类型 | 缓存策略 | 说明 |
|---------|---------|------|
| HTML | no-cache | 始终获取最新 |
| CSS/JS | max-age=31536000, immutable | 长期缓存（1年） |
| 图片 | max-age=86400 | 1天缓存 |
| PWA (sw.js) | cache-first | 离线优先 |

#### 9.2.2 CDN 配置

```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 9.3 性能目标

| 指标 | 目标值 |
|-----|-------|
| First Contentful Paint (FCP) | < 1.8s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |

---

## 10. 监控与日志

### 10.1 日志配置

```typescript
// lib/logger.ts
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      stack: error?.stack
    }));
  }
};
```

### 10.2 健康检查

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

---

## 11. 安全配置

### 11.1 HTTPS 配置

**生产环境必须启用 HTTPS**

### 11.2 安全头

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};
```

---

## 12. 备份与恢复

### 12.1 备份策略

```bash
# 备份应用代码
git clone <repo-url> backup-app

# 备份环境变量
cp .env.production backup-env

# 备份数据（如果使用数据库）
pg_dump -U user database > backup.sql
```

### 12.2 恢复流程

```bash
# 1. 恢复代码
git clone <repo-url>
npm install

# 2. 恢复环境变量
cp backup-env .env.production

# 3. 恢复数据（如果使用数据库）
psql -U user database < backup.sql

# 4. 重启服务
pm2 restart laughterbox
```

---

## 13. 故障排查

### 13.1 常见问题

#### 13.1.1 构建失败

```bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

#### 13.1.2 PWA 不工作

**检查清单**：
- 确认 Service Worker
- 浏览器开发者工具 → Application → Service Workers
- 重新注册
- 开发者工具 → Application → Service Workers → Unregister
- 确保使用 HTTPS（localhost 除外）

#### 13.1.3 样式不生效

**检查清单**：
- 检查 Tailwind CSS 配置
- 确保 globals.css 正确导入
- 清理缓存：`npm run clean && npm run dev`

#### 13.1.4 端口占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 npm run start
```

---

## 14. 检查清单

### 14.1 部署前检查

- [ ] 所有环境变量已配置
- [ ] 构建成功 (`npm run build`)
- [ ] TypeScript 检查通过
- [ ] PWA 配置正确
- [ ] 环境变量文件已加密或安全存储
- [ ] 备份已创建

### 14.2 部署后检查

- [ ] 应用正常启动
- [ ] 首页可访问
- [ ] 随机笑话功能正常
- [ ] 主题切换正常
- [ ] PWA 可安装
- [ ] 离线功能正常
- [ ] 日志无错误
- [ ] 性能指标正常
- [ ] HTTPS 已启用

---

## 15. 常用命令速查

```bash
# 构建
npm run build        # 生产构建
npm run dev          # 开发服务器
npm run start        # 生产服务器

# 维护
npm run lint         # 代码检查
npm run clean        # 清理 .next 目录

# Docker
docker build -t laughterbox:latest .  # 构建镜像
docker run -p 3000:3000 laughterbox:latest  # 运行容器

# PM2
pm2 start server.js  # 启动
pm2 stop laughterbox # 停止
pm2 restart laughterbox # 重启
pm2 logs laughterbox # 查看日志
pm2 monit            # 监控
```

---

## 16. 相关资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 部署指南](https://vercel.com/docs)
- [腾讯云 EdgeOne Pages 文档](https://cloud.tencent.com/product/edgeone)
- [Docker 官方文档](https://docs.docker.com/)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)

---

*本文档遵循 OpenSpec 规范 v1.0*
