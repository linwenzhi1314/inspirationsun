# AGENTS.md

## 项目概述

个人博客网站，支持内容发布和一键同步到 X (Twitter)。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **External API**: Twitter/X API v2

## 目录结构

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API 路由
│   │   │   ├── articles/       # 文章 API
│   │   │   ├── admin/          # 管理后台 API
│   │   │   └── twitter/        # Twitter 集成 API
│   │   ├── articles/           # 文章详情页
│   │   ├── admin/              # 管理后台页面
│   │   └── page.tsx            # 首页
│   ├── components/             # React 组件
│   ├── lib/                    # 工具库
│   │   └── twitter.ts          # Twitter API 集成
│   └── storage/                # 数据存储
│       └── database/           # 数据库相关
│           ├── shared/         # 共享模型
│           │   └── schema.ts   # 数据库 schema
│           └── supabase-client.ts
├── public/                     # 静态资源
└── DESIGN.md                   # 设计规范
```

## 核心功能

### 1. 文章管理
- 创建、编辑、发布文章
- 文章列表展示
- 文章详情页
- 支持封面图、摘要

### 2. Twitter 集成
- OAuth 2.0 认证
- 自动同步发布
- Token 自动刷新
- 发布状态追踪

## 数据库设计

### articles 表
- `id`: 主键
- `title`: 标题
- `slug`: URL 别名（唯一）
- `content`: 正文内容
- `excerpt`: 摘要
- `cover_image`: 封面图 URL
- `published`: 是否发布
- `twitter_post_id`: Twitter 推文 ID
- `twitter_posted_at`: 推文发布时间
- `created_at`, `updated_at`: 时间戳

### profiles 表
- `id`: 主键
- `twitter_id`: Twitter 用户 ID
- `twitter_username`: Twitter 用户名
- `twitter_access_token`: 访问令牌
- `twitter_refresh_token`: 刷新令牌
- `twitter_token_expires_at`: 令牌过期时间
- `created_at`, `updated_at`: 时间戳

## API 端点

### 公开 API
- `GET /api/articles` - 获取已发布文章列表
- `GET /api/articles/[slug]` - 获取文章详情

### 管理 API
- `GET /api/admin/articles` - 获取所有文章（含未发布）
- `POST /api/admin/articles` - 创建文章

### Twitter API
- `GET /api/twitter/auth` - 获取 Twitter 授权链接
- `GET /api/twitter/callback` - OAuth 回调处理
- `POST /api/twitter/tweet` - 发布推文

## 环境变量

### 必需配置
- `TWITTER_CLIENT_ID` - Twitter App Client ID
- `TWITTER_CLIENT_SECRET` - Twitter App Client Secret

### 自动注入
- `COZE_SUPABASE_URL` - Supabase 项目 URL
- `COZE_SUPABASE_ANON_KEY` - Supabase 匿名密钥
- `COZE_SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务角色密钥
- `COZE_PROJECT_DOMAIN_DEFAULT` - 项目域名

## 开发流程

1. 创建文章：访问 `/admin/new`
2. 连接 Twitter：访问 `/admin` 并点击连接按钮
3. 发布文章时勾选"同步到 X"

## Twitter API 配置步骤

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/)
2. 创建新的 Twitter App
3. 启用 OAuth 2.0
4. 设置回调 URL: `https://your-domain/api/twitter/callback`
5. 复制 Client ID 和 Client Secret 到环境变量

## 构建与部署

```bash
# 开发环境
pnpm install
pnpm run dev

# 生产构建
pnpm run build
pnpm run start
```

## 注意事项

- Twitter 推文字符限制为 280 字符
- Twitter Token 有效期为 2 小时，需要自动刷新
- 文章 slug 必须唯一
- 所有数据库操作都通过 Supabase Client
