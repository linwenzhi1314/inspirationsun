# AGENTS.md

## 项目概述

个人博客网站，专注"混沌直觉的系统化生存"——一个高敏感跨界者的认知实验手册。支持内容发布和一键同步到 X (Twitter)。

## 核心定位

### 一句话定义
"用多学科之眼，翻译混沌世界；用实战之躯，验证底层规律。"

### 三个层次
1. **底层（感受层）**：高敏感体质——捕捉别人忽略的"信号"
2. **中层（认知层）**：跨界整合者——融合多学科"元认知"
3. **顶层（验证层）**：直觉逆袭者——混沌直觉+系统验证

### 核心标语
"用敏感捕捉信号，用跨界解码规律，用实战验证真知。"

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **External API**: Twitter/X API v2

## 内容分类系统

### 四个核心栏目

1. **【信号捕捉】(signal_capture)**
   - 记录"说不清道不明"的直觉瞬间
   - 短小精悍，约 300 字
   - 图标：📡
   - 颜色：蓝色

2. **【跨界解码】(cross_decode)**
   - 用≥2个学科框架拆解混沌现象
   - 深度长文，约 1500 字
   - 图标：🔬
   - 颜色：紫色

3. **【认知实验】(cognitive_experiment)**
   - 记录基于理论的现实"下注"及其结果
   - 包含决策过程和结果反思
   - 图标：⚗️
   - 颜色：绿色

4. **【自洽手记】(self_consistent)**
   - 每月一篇复盘
   - 记录从混沌走向自洽的迭代轨迹
   - 图标：📖
   - 颜色：橙色

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
│   │   ├── about/              # 关于我页面
│   │   └── page.tsx            # 首页
│   ├── components/             # React 组件
│   ├── lib/                    # 工具库
│   │   ├── twitter.ts          # Twitter API 集成
│   │   └── constants.ts        # 常量配置（分类等）
│   └── storage/                # 数据存储
│       └── database/           # 数据库相关
│           ├── shared/         # 共享模型
│           │   └── schema.ts   # 数据库 schema
│           └── supabase-client.ts
├── public/                     # 静态资源
├── AGENTS.md                   # 项目说明（本文件）
└── DESIGN.md                   # 设计规范
```

## 数据库设计

### articles 表
- `id`: 主键
- `title`: 标题
- `slug`: URL 别名（唯一）
- `content`: 正文内容
- `excerpt`: 摘要
- `cover_image`: 封面图 URL
- `category`: 文章分类（signal_capture/cross_decode/cognitive_experiment/self_consistent）
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

### 创建文章
1. 访问 `/admin/new`
2. 选择文章分类（四个核心栏目之一）
3. 填写标题、内容等信息
4. 选择是否立即发布
5. 选择是否同步到 X
6. 保存文章

### Twitter 集成
1. 访问 `/admin` 并点击连接按钮
2. 完成 Twitter OAuth 授权
3. 发布文章时勾选"同步到 X"

## 年度命题

"混沌直觉的系统化生存——一个高敏感跨界者的认知实验手册"

### 每日 30 分钟输出结构
1. **捕捉混沌**（5分钟）：记录直觉瞬间
2. **多学科拆解**（15分钟）：用≥2个学科解释
3. **验证与落子**（10分钟）：设计明天的"下注"
4. **结论发布**：形成实验笔记

## 为什么这套定位能穿越周期？

1. **反脆弱性**：市场波动越大，"直觉+验证"经验越值钱
2. **不可抄袭**：别人抄框架，抄不走"用直觉赚过钱"的实战体感
3. **终局价值**：5年后拥有"被市场验证过的认知方法论"

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
- 文章分类必须是四个核心栏目之一
