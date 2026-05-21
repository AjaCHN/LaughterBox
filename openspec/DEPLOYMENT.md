# LaughterBox 部署指南

## 概述

本文档提供了 LaughterBox 项目的部署配置、环境变量设置、构建优化和生产环境最佳实践。

## 部署架构

```
┌─────────────────────────────────────┐
│           CDN / Load Balancer       │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│          Next.js Standalone          │
│              Server                  │
│  ┌─────────────────────────────┐   │
│  │     Node.js Runtime         │   │
│  │  ┌───────────────────────┐  │   │
│  │  │   Next.js App         │  │   │
│  │  │   - Static Pages      │  │   │
│  │  │   - API Routes        │  │   │
│  │  │   - SSR               │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │   Service Worker            │   │
│  │   (PWA Offline Support)     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 部署前准备

### 环境要求

- **Node.js**: >= 18.17.0
- **npm**: >= 9.0.0
- **操作系统**: Linux, macOS, Windows

### 依赖检查

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 验证项目依赖
npm list next react react-dom
```

---

## 构建配置

### Next.js 配置 (next.config.ts)

```typescript
import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['motion'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      }
    }
    return config
  },
}

export default withPWA(nextConfig)
```

### 关键配置说明

| 配置项 | 值 | 说明 |
|-------|-----|------|
| `output` | "standalone" | 输出独立部署包 |
| `reactStrictMode` | true | 启用 React 严格模式 |
| `transpilePackages` | ['motion'] | 转译第三方包 |
| `eslint.ignoreDuringBuilds` | true | 构建时忽略 ESLint |
| `typescript.ignoreBuildErrors` | false | TypeScript 错误阻止构建 |

---

## 环境变量

### 开发环境

```bash
# .env.local
NODE_ENV=development
DISABLE_HMR=false
```

### 生产环境

```bash
# .env.production
NODE_ENV=production
DISABLE_HMR=true
```

### 运行时变量

| 变量名 | 类型 | 描述 | 默认值 |
|-------|------|------|--------|
| `NODE_ENV` | string | 运行环境 | development |
| `DISABLE_HMR` | string | 禁用热模块替换 | false |
| `PORT` | number | 服务端口 | 3000 |
| `HOSTNAME` | string | 主机地址 | localhost |

---

## 构建流程

### 1. 安装依赖

```bash
npm ci
# 或
npm install --production=false
```

### 2. 构建应用

```bash
npm run build
```

### 3. 构建输出

```
.next/
├── standalone/        # 独立部署包
│   ├── server.js      # Node.js 服务器
│   ├── package.json
│   └── .next/         # Next.js 资源
│
├── static/            # 静态资源
│   ├── _next/         # Next.js 静态文件
│   └── manifest.json  # PWA 清单
│
└── server/            # 服务端文件
    ├── app/
    └── pages/
```

### 4. 启动服务器

```bash
# 开发环境
npm run dev

# 生产环境
npm run start

# 自定义端口
PORT=8080 npm run start
```

---

## 部署方式

### 1. Vercel 部署

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

Vercel 自动配置:

- 构建命令: `npm run build`
- 输出目录: `.next`
- 环境变量: 在 Vercel 控制台配置

### 2. Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

构建和运行:

```bash
# 构建镜像
docker build -t laughterbox:latest .

# 运行容器
docker run -p 3000:3000 laughterbox:latest
```

### 3. 传统服务器部署

```bash
# 1. 构建应用
npm run build

# 2. 安装生产依赖
npm ci --production

# 3. 复制到服务器
scp -r .next user@server:/path/to/app

# 4. 启动服务
NODE_ENV=production PORT=3000 node .next/standalone/server.js
```

### 4. PM2 进程管理

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

PM2 配置文件 (`ecosystem.config.js`):

```javascript
module.exports = {
  apps: [{
    name: 'laughterbox',
    script: '.next/standalone/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
```

---

## PWA 部署

### Service Worker 生成

```bash
npm run build
```

生成文件:

```
public/
├── sw.js              # Service Worker
├── sw.js.map
├── workbox-*.js       # Workbox 运行时
└── manifest.json      # PWA 清单
```

### PWA 配置

```json
{
  "name": "LaughterBox",
  "short_name": "LaughterBox",
  "description": "最全面的短篇笑话集合",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
```

### 离线支持

- **预缓存**: Next.js 生成的静态资源自动缓存
- **运行时缓存**: 可通过 Workbox 配置
- **离线页面**: Service Worker 拦截请求

---

## 性能优化

### 构建优化

#### 分析构建体积

```bash
# 使用 @next/bundle-analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

#### 优化策略

1. **代码分割**: Next.js 自动按路由分割
2. **Tree Shaking**: 移除未使用的代码
3. **压缩**: 生产构建自动压缩
4. **字体优化**: 使用 `next/font` 自动优化

### 运行时优化

#### 缓存策略

| 资源类型 | 缓存策略 | 说明 |
|---------|---------|------|
| HTML | no-cache | 始终获取最新 |
| CSS/JS | max-age=31536000, immutable | 长期缓存 |
| 图片 | max-age=86400 | 一天缓存 |
| PWA | cache-first | 离线优先 |

#### CDN 配置

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

---

## 监控与日志

### 日志配置

```typescript
// 自定义日志格式
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    }))
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      stack: error?.stack
    }))
  }
}
```

### 健康检查

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
}
```

---

## 安全配置

### HTTPS 配置

```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://www.example.com/:path*'
      }
    ]
  }
}
```

### 安全头

```typescript
// next.config.js
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
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ]
  }
}
```

---

## 备份与恢复

### 备份策略

```bash
# 备份应用代码
git clone <repo-url> backup-app

# 备份环境变量
cp .env.production backup-env

# 备份数据
# (如果使用数据库)
pg_dump -U user database > backup.sql
```

### 恢复流程

```bash
# 1. 恢复代码
git clone <repo-url>
npm install

# 2. 恢复环境变量
cp backup-env .env.production

# 3. 恢复数据
psql -U user database < backup.sql

# 4. 重启服务
pm2 restart laughterbox
```

---

## 故障排查

### 常见问题

#### 1. 构建失败

```bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

#### 2. PWA 不工作

```bash
# 检查 Service Worker
# 浏览器开发者工具 → Application → Service Workers

# 重新注册
# 开发者工具 → Application → Service Workers → Unregister
```

#### 3. 样式不生效

```bash
# 检查 Tailwind CSS
# 确保 @import "tailwindcss" 在 globals.css 第一行

# 清理缓存
npm run clean
npm run dev
```

#### 4. 端口占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 npm run start
```

---

## 检查清单

### 部署前检查

- [ ] 所有环境变量已配置
- [ ] 构建成功 (`npm run build`)
- [ ] TypeScript 检查通过
- [ ] PWA 配置正确
- [ ] 环境变量文件已加密或安全存储
- [ ] 备份已创建

### 部署后检查

- [ ] 应用正常启动
- [ ] 首页可访问
- [ ] 随机笑话功能正常
- [ ] 主题切换正常
- [ ] PWA 可安装
- [ ] 离线功能正常
- [ ] 日志无错误
- [ ] 性能指标正常

---

## 附录

### 常用命令速查

```bash
# 构建
npm run build              # 生产构建
npm run dev                # 开发服务器
npm run start              # 生产服务器

# 维护
npm run lint               # 代码检查
npm run clean              # 清理缓存

# Docker
docker build -t app .      # 构建镜像
docker run -p 3000:3000 app  # 运行容器

# PM2
pm2 start server.js        # 启动
pm2 stop app               # 停止
pm2 restart app            # 重启
pm2 logs app               # 查看日志
pm2 monit                  # 监控
```

### 相关资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 部署指南](https://vercel.com/docs)
- [Docker 官方文档](https://docs.docker.com/)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

*本文档为 LaughterBox 部署指南*
