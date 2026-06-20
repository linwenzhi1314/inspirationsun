import { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ChangePasswordDialog } from '@/components/admin/ChangePasswordDialog';

export const metadata: Metadata = {
  title: '管理后台 - 混沌中的探路者',
  description: '文章管理系统',
};

export default async function AdminPage() {
  // 服务端检查认证状态
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  
  if (authCookie?.value !== 'true') {
    redirect('/admin/login');
  }

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
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  登出
                </button>
              </form>
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

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <ArticleList />
      </main>
    </div>
  );
}

// 文章列表组件
async function ArticleList() {
  let articles: any[] = [];
  
  try {
    const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || `http://localhost:${process.env.DEPLOY_RUN_PORT || 5000}`;
    const protocol = baseUrl.startsWith('http') ? '' : 'https://';
    const res = await fetch(`${protocol}${baseUrl}/api/admin/articles`, {
      cache: 'no-store',
    });
    const data = await res.json();
    articles = data.articles || [];
  } catch (error) {
    console.error('获取文章失败:', error);
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">还没有文章</p>
        <Link
          href="/admin/new"
          className="text-blue-600 hover:text-blue-700"
        >
          创建第一篇文章
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标题
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              分类
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状态
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建时间
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {article.title}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {article.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {article.published ? '已发布' : '草稿'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString('zh-CN')}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                {article.published && (
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    查看
                  </Link>
                )}
                <Link
                  href={`/admin/edit/${article.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  编辑
                </Link>
                <DeleteButton articleId={article.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 删除按钮组件
function DeleteButton({ articleId }: { articleId: number }) {
  return (
    <form
      action={async () => {
        'use server';
        // 这里需要实现服务端删除逻辑
      }}
      className="inline"
    >
      <button
        type="submit"
        className="text-red-600 hover:text-red-900"
        onClick={(e) => {
          if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
            e.preventDefault();
          }
        }}
      >
        删除
      </button>
    </form>
  );
}
