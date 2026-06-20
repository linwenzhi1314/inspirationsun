# 🚀 Vercel 构建状态检查工具

## 快速使用

### 方法 1：使用本地脚本（推荐）

```bash
# 在项目根目录运行
node scripts/check-build.js
```

这个脚本会自动：
- 检查最新的部署状态
- 显示构建是否成功
- 如果失败，显示错误日志

### 方法 2：使用 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没安装）
pnpm add -g vercel

# 查看所有部署
vercel list

# 查看特定部署的日志
vercel logs [deployment-url]

# 实时查看构建日志
vercel logs [deployment-url] --follow
```

### 方法 3：使用 Vercel API（自动化）

1. **创建 API Token**
   - 访问：https://vercel.com/account/tokens
   - 点击 "Create Token"
   - 复制生成的 token

2. **获取项目 ID**
   - 访问 Vercel Dashboard
   - 进入你的项目 → Settings → General
   - 复制 "Project ID"

3. **创建配置文件**
   在项目根目录创建 `.env.local` 文件：
   ```env
   VERCEL_TOKEN=your_token_here
   VERCEL_PROJECT_ID=your_project_id_here
   ```

4. **运行检查脚本**
   ```bash
   node scripts/check-build.js
   ```

## 错误信息格式化

当构建失败时，脚本会自动提取并显示：
- ❌ 错误类型
- 📄 错误文件路径
- 🔍 错误行号
- 💡 错误描述

## 常见构建错误

### 1. 模块找不到
```
Module not found: Can't resolve 'xxx'
```
**解决方案**：安装缺失的依赖
```bash
pnpm add xxx
```

### 2. TypeScript 错误
```
Type error: xxx
```
**解决方案**：修复类型错误或安装缺失的类型定义

### 3. PostCSS 错误
```
Error: Cannot find module 'postcss'
```
**解决方案**：
```bash
pnpm add postcss
pnpm add -D @tailwindcss/postcss
```

### 4. 环境变量缺失
```
Error: Missing environment variable
```
**解决方案**：在 Vercel Dashboard 中添加环境变量

## 自动化构建检查

可以创建一个 Git hook，在推送后自动检查构建状态：

```bash
# .git/hooks/post-push
#!/bin/sh
echo "检查 Vercel 构建状态..."
node scripts/check-build.js
```

## 获取详细帮助

如果遇到问题，可以：
1. 查看 Vercel 文档：https://vercel.com/docs
2. 检查项目 Issues：https://github.com/vercel/vercel/issues
3. 运行 `vercel --help` 查看更多命令

## 📊 快速链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **项目部署历史**: https://vercel.com/your-username/inspirationsun/deployments
- **项目设置**: https://vercel.com/your-username/inspirationsun/settings
- **环境变量**: https://vercel.com/your-username/inspirationsun/settings/environment-variables
