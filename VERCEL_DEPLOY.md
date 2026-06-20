# Vercel 部署指南

## 为什么部署到 Vercel？

✅ **解决"未授权访问"问题**
- 没有平台额外的安全限制
- 完全控制路由访问权限

✅ **更好的性能**
- 全球 CDN 加速
- 自动 HTTPS
- 更快的访问速度

✅ **完整的功能支持**
- 环境变量管理
- 自动部署
- 域名绑定

## 部署步骤

### 1. 准备工作

#### 1.1 注册 Vercel 账号
访问 [vercel.com](https://vercel.com) 注册账号

#### 1.2 准备 GitHub 仓库
```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 导入项目到 Vercel

1. 登录 Vercel Dashboard
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

### 3. 配置项目

#### 3.1 框架预设
- Framework Preset: **Next.js**

#### 3.2 构建配置
- Build Command: `pnpm run build`
- Output Directory: `.next`
- Install Command: `pnpm install`

### 4. 配置环境变量

在 Vercel Dashboard 中，进入项目设置 → Environment Variables，添加以下变量：

#### 必需的环境变量

```env
# Twitter OAuth 配置（如果需要同步到 Twitter）
TWITTER_CLIENT_ID=你的_twitter_client_id
TWITTER_CLIENT_SECRET=你的_twitter_client_secret

# 管理密码（可选，不设置则使用默认密码 admin123）
ADMIN_PASSWORD=你的管理密码
```

#### 自动注入的环境变量（Vercel + Supabase 集成）

如果你使用 Vercel 的 Supabase 集成，以下变量会自动注入：
- `COZE_SUPABASE_URL`
- `COZE_SUPABASE_ANON_KEY`
- `COZE_SUPABASE_SERVICE_ROLE_KEY`

### 5. 部署

1. 点击 "Deploy" 按钮
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，Vercel 会提供一个域名（如 `your-project.vercel.app`）

### 6. 自定义域名（可选）

1. 在项目设置中，点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录
4. 等待 SSL 证书自动配置完成

## 部署后测试

### 测试访问

1. **访问首页**：`https://你的域名/`
2. **访问管理后台**：`https://你的域名/admin`
   - 应该看到登录表单（不是"未授权访问"弹窗）
   - 输入密码登录
3. **测试文章管理**：创建、编辑、删除文章

### 测试 Twitter 同步

1. 在管理后台连接 Twitter 账号
2. 创建文章并勾选"同步到 X"
3. 检查 Twitter 是否发布成功

## 常见问题

### 1. 构建失败
- 检查 `package.json` 中的依赖
- 确保使用 `pnpm` 作为包管理器
- 查看 Vercel 构建日志

### 2. 数据库连接失败
- 确认 Supabase 项目已创建
- 检查环境变量是否正确配置
- 确认 Supabase 项目未暂停

### 3. Twitter OAuth 失败
- 确认 Twitter App 配置正确
- 检查回调 URL 是否设置为 `https://你的域名/api/twitter/callback`
- 确认环境变量 `TWITTER_CLIENT_ID` 和 `TWITTER_CLIENT_SECRET` 已设置

## 对比：Coze 平台 vs Vercel

| 特性 | Coze 平台 | Vercel |
|------|----------|--------|
| 访问控制 | 平台额外限制 | 完全自主控制 |
| 部署速度 | 快速 | 快速 |
| 自定义域名 | 支持 | 支持 |
| 环境变量 | 自动注入 | 手动配置 |
| 数据库 | 自动集成 Supabase | 需要手动集成 |
| 访问速度 | 中等 | 快（全球 CDN） |

## 推荐方案

**推荐使用 Vercel 部署**，因为：
1. ✅ 解决"未授权访问"问题
2. ✅ 更好的性能和访问速度
3. ✅ 完整的功能控制
4. ✅ 专业的部署平台

## 需要帮助？

如果部署过程中遇到问题：
1. 查看 Vercel 构建日志
2. 检查浏览器控制台错误
3. 确认所有环境变量已正确配置
