# 项目重命名指南

将项目从 `my-blog` 重命名为 `inspirationsun`

## 📋 重命名步骤

### 第一步：提交本地更改

已完成：
- ✅ 更新 `package.json` 中的项目名称为 `inspirationsun`

### 第二步：在 GitHub 重命名仓库

#### 操作步骤：

1. **访问 GitHub 仓库**
   - 打开 https://github.com/linwenzhi1314/my-blog

2. **进入设置页面**
   - 点击仓库顶部的 **Settings** 标签

3. **找到重命名选项**
   - 在 General 设置页面顶部找到 **Repository name** 输入框
   - 将 `my-blog` 改为 `inspirationsun`

4. **确认重命名**
   - 点击 **Rename** 按钮
   - GitHub 会自动将旧 URL 重定向到新 URL

#### ⚠️ 注意事项：

- GitHub 会自动设置重定向，旧的仓库 URL 会自动跳转到新 URL
- 但是你需要更新本地 Git 远程仓库地址

#### 更新本地 Git 配置：

```bash
# 更新远程仓库地址
git remote set-url origin https://github.com/linwenzhi1314/inspirationsun.git

# 推送更改
git add .
git commit -m "refactor: 重命名项目为 inspirationsun"
git push
```

### 第三步：在 Vercel 重命名项目

#### 方法一：直接重命名（推荐）

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard

2. **进入项目设置**
   - 点击你的项目
   - 点击 **Settings** 标签

3. **修改项目名称**
   - 在 **General** 设置中找到 **Project Name**
   - 将 `my-blog` 改为 `inspirationsun`
   - 点击 **Save** 保存

4. **更新域名**
   - 在 **Domains** 标签中
   - 你会看到默认域名变为：`inspirationsun.vercel.app`
   - 旧的域名会自动重定向到新域名

#### 方法二：创建新项目（如果方法一不可行）

1. **删除旧项目**
   - 在 Vercel Dashboard → Settings → 滚动到页面底部
   - 点击 **Delete Project**

2. **导入新项目**
   - 点击 **Add New...** → **Project**
   - 选择 GitHub 仓库 `linwenzhi1314/inspirationsun`
   - 项目名称会自动填充为 `inspirationsun`
   - 重新配置环境变量
   - 点击 **Deploy**

### 第四步：更新环境变量（如果创建了新项目）

如果在 Vercel 创建了新项目，需要重新配置环境变量：

| Name | Value |
|------|-------|
| `COZE_SUPABASE_URL` | 你的 Supabase URL |
| `COZE_SUPABASE_ANON_KEY` | 你的 Supabase anon key |
| `COZE_SUPABASE_SERVICE_ROLE_KEY` | 你的 Supabase service role key |

### 第五步：测试新域名

重命名完成后：

1. **访问新域名**
   - `https://inspirationsun.vercel.app`

2. **测试管理后台**
   - `https://inspirationsun.vercel.app/admin`
   - 使用默认密码：`admin123`

3. **验证所有功能**
   - 创建文章
   - 修改密码
   - 发布内容

## 🎯 预期结果

重命名成功后：

- ✅ GitHub 仓库：`github.com/linwenzhi1314/inspirationsun`
- ✅ Vercel 域名：`inspirationsun.vercel.app`
- ✅ 旧 URL 自动重定向到新 URL
- ✅ 所有功能正常工作

## 📊 域名对比

| 项目 | 旧名称 | 新名称 |
|------|--------|--------|
| GitHub 仓库 | my-blog | inspirationsun |
| Vercel 域名 | my-blog-xxx.vercel.app | inspirationsun.vercel.app |

## 💡 自定义域名（可选）

如果你想使用自定义域名（如 `inspirationsun.com`）：

1. 在 Vercel Dashboard → **Domains**
2. 点击 **Add Domain**
3. 输入你的域名
4. 按照提示配置 DNS 记录
5. 等待 DNS 生效（通常几分钟到几小时）

## 🔗 快速链接

- GitHub 仓库设置：https://github.com/linwenzhi1314/my-blog/settings
- Vercel Dashboard：https://vercel.com/dashboard

---

**建议顺序**：先在 GitHub 重命名 → 再在 Vercel 重命名 → 最后更新本地配置
