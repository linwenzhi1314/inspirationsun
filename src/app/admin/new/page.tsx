'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ARTICLE_CATEGORIES, type ArticleCategory } from '@/lib/constants';

export default function NewArticlePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('signal_capture');
  const [published, setPublished] = useState(false);
  const [syncToTwitter, setSyncToTwitter] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth');
        const data = await response.json();
        if (!data.authenticated) {
          router.push('/admin');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('检查登录状态失败:', err);
        router.push('/admin');
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  // 自动生成 slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          cover_image: coverImage,
          category,
          published,
          sync_to_twitter: syncToTwitter,
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        alert('创建失败，请重试');
      }
    } catch (error) {
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 加载中
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  // 未授权
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">新建文章</h1>
              <p className="text-gray-600 mt-1">创作新的内容</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              返回后台
            </Link>
          </div>
        </div>
      </header>

      {/* 表单 */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              文章标题 *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入文章标题"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              URL 别名 *
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="url-slug"
              required
            />
            <p className="text-gray-500 text-sm mt-1">URL 中的唯一标识符</p>
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章分类 *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ARTICLE_CATEGORIES.map((cat) => (
                <label
                  key={cat.key}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    category === cat.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.key}
                    checked={category === cat.key}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-gray-900">{cat.label}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{cat.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 封面图 */}
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
              封面图 URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* 摘要 */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              文章摘要
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="简短的文章摘要..."
            />
          </div>

          {/* 正文 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              文章正文 *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="支持 Markdown 格式..."
              required
            />
          </div>

          {/* 选项 */}
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">立即发布</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={syncToTwitter}
                onChange={(e) => setSyncToTwitter(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">同步到 X (Twitter)</span>
            </label>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '保存文章'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
