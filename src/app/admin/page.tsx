'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangePasswordDialog } from '@/components/admin/ChangePasswordDialog';
import { ARTICLE_CATEGORIES } from '@/lib/constants';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [dbNeedsInit, setDbNeedsInit] = useState(false);
  const [pat, setPat] = useState('');
  const [initLoading, setInitLoading] = useState(false);
  const [initError, setInitError] = useState('');
  const [initSql, setInitSql] = useState('');

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        console.error('检查登录状态失败:', err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // 获取文章列表
  const fetchArticles = async () => {
    setLoadingArticles(true);
    setDbNeedsInit(false);
    try {
      const response = await fetch('/api/admin/articles');
      const data = await response.json();
      if (response.ok) {
        setArticles(data.articles || []);
      } else {
        // 检测是否需要初始化数据库
        if (data.error?.includes('schema cache') || data.error?.includes('articles')) {
          setDbNeedsInit(true);
          setInitSql(data.sql || '');
        }
      }
    } catch (err) {
      console.error('获取文章失败:', err);
      setDbNeedsInit(true);
    } finally {
      setLoadingArticles(false);
    }
  };

  // 初始化数据库
  const handleInitDb = async () => {
    if (!pat) {
      setInitError('请输入 Supabase PAT');
      return;
    }
    setInitLoading(true);
    setInitError('');
    
    try {
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pat }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDbNeedsInit(false);
        setPat('');
        // 等待几秒让 schema cache 刷新
        setTimeout(() => fetchArticles(), 3000);
      } else {
        setInitError(data.error || '初始化失败');
        if (data.sql) {
          setInitSql(data.sql);
        }
      }
    } catch (err) {
      setInitError('初始化请求失败');
    } finally {
      setInitLoading(false);
    }
  };

  // 登录后获取文章
  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError(data.error || '密码错误，请重试');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('登出失败:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchArticles();
      } else {
        alert('删除失败');
      }
    } catch (err) {
      alert('删除失败');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: true }),
      });

      if (response.ok) {
        fetchArticles();
      } else {
        alert('发布失败');
      }
    } catch (err) {
      alert('发布失败');
    }
  };

  // 获取分类信息
  const getCategoryInfo = (key: string) => {
    return ARTICLE_CATEGORIES.find(c => c.key === key) || { icon: '📄', label: key };
  };

  // 根据 Tab 过滤文章
  const filteredArticles = articles.filter(article => 
    activeTab === 'published' ? article.published : !article.published
  );

  // 加载中
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  // 未登录，显示登录表单
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">管理后台登录</h1>
              <p className="text-gray-600 text-sm">请输入管理密码访问后台</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  管理密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入管理密码"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
                返回首页
              </Link>
            </div>
          </div>

          <div className="text-center mt-4 text-gray-400 text-xs">
            默认密码: admin123（可在登录后修改）
          </div>
        </div>
      </div>
    );
  }

  // 已登录，显示管理后台
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
              <p className="text-gray-600 mt-1">管理你的文章内容</p>
            </div>
            <div className="flex gap-4 items-center">
              <ChangePasswordDialog />
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                查看网站
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                登出
              </button>
              <Link
                href="/admin/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                新建文章
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab 切换 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'published'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            已发布 ({articles.filter(a => a.published).length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'drafts'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            草稿箱 ({articles.filter(a => !a.published).length})
          </button>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'published' ? '已发布文章' : '草稿箱'}
            </h2>
          </div>

          {loadingArticles ? (
            <div className="p-6 text-center text-gray-500">
              加载中...
            </div>
          ) : dbNeedsInit ? (
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h3 className="text-amber-800 font-medium mb-2">数据库表不存在</h3>
                <p className="text-amber-700 text-sm mb-4">
                  需要初始化数据库表。有两种方式：
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white rounded p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">方式一：自动初始化（推荐）</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      输入你的 Supabase Personal Access Token (PAT) 一键创建表。
                      PAT 获取地址：<a 
                        href="https://supabase.com/dashboard/account/tokens" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >https://supabase.com/dashboard/account/tokens</a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pat}
                        onChange={(e) => setPat(e.target.value)}
                        placeholder="输入你的 Supabase PAT"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleInitDb}
                        disabled={initLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {initLoading ? '初始化中...' : '一键初始化'}
                      </button>
                    </div>
                    {initError && (
                      <p className="text-red-600 text-sm mt-2">{initError}</p>
                    )}
                  </div>
                  
                  <div className="bg-white rounded p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">方式二：手动执行 SQL</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      在 Supabase Dashboard SQL Editor 中执行以下语句：
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{initSql || `-- 创建 articles 表
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'signal_capture',
  published BOOLEAN DEFAULT false,
  twitter_post_id TEXT,
  twitter_posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 创建 settings 表  
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 授权
GRANT ALL ON articles TO anon;
GRANT ALL ON articles TO authenticated;
GRANT ALL ON articles TO service_role;
GRANT ALL ON settings TO anon;
GRANT ALL ON settings TO authenticated;
GRANT ALL ON settings TO service_role;`}</pre>
                    </div>
                    <button
                      onClick={() => fetchArticles()}
                      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      手动完成后刷新
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>
                {activeTab === 'published' 
                  ? '还没有已发布的文章' 
                  : '草稿箱为空'}
              </p>
              {activeTab === 'drafts' && (
                <Link
                  href="/admin/new"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  创建新文章
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => {
                const categoryInfo = getCategoryInfo(article.category);
                return (
                  <div key={article.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{categoryInfo.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>{categoryInfo.label}</span>
                          <span>•</span>
                          <span>
                            {new Date(article.created_at).toLocaleDateString('zh-CN')}
                          </span>
                          <span>•</span>
                          <span className={article.published ? 'text-green-600' : 'text-amber-600'}>
                            {article.published ? '已发布' : '草稿'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!article.published && (
                        <button
                          onClick={() => handlePublish(article.id)}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          发布
                        </button>
                      )}
                      <Link
                        href={`/admin/edit/${article.id}`}
                        className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}