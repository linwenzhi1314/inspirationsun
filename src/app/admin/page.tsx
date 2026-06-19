import { Metadata } from 'next';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const metadata: Metadata = {
	title: '管理后台 - 我的博客',
	description: '文章管理系统',
};

interface Article {
	id: number;
	title: string;
	slug: string;
	excerpt: string | null;
	published: boolean;
	created_at: string;
	updated_at: string;
	twitter_post_id: string | null;
}

async function getAllArticles(): Promise<Article[]> {
	try {
		const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || `http://localhost:${process.env.DEPLOY_RUN_PORT || 5000}`;
		const protocol = baseUrl.startsWith('http') ? '' : 'https://';
		const res = await fetch(`${protocol}${baseUrl}/api/admin/articles`, {
			cache: 'no-store',
		});

		if (!res.ok) {
			throw new Error('获取文章失败');
		}

		const data = await res.json();
		return data.articles || [];
	} catch (error) {
		console.error('获取文章错误:', error);
		return [];
	}
}

export default async function AdminPage() {
	const articles = await getAllArticles();

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
						<div className="flex gap-4">
							<Link
								href="/"
								className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
							>
								查看网站
							</Link>
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
				{articles.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-lg border border-gray-200">
						<div className="text-gray-400 text-lg mb-4">
							还没有创建任何文章
						</div>
						<Link
							href="/admin/new"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							创建第一篇文章
						</Link>
					</div>
				) : (
					<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										标题
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										状态
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										X 同步
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
											<div className="text-sm text-gray-500">
												/{article.slug}
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
													article.published
														? 'bg-green-100 text-green-800'
														: 'bg-yellow-100 text-yellow-800'
												}`}
											>
												{article.published ? '已发布' : '草稿'}
											</span>
										</td>
										<td className="px-6 py-4">
											{article.twitter_post_id ? (
												<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
													已同步
												</span>
											) : (
												<span className="text-gray-400 text-sm">未同步</span>
											)}
										</td>
										<td className="px-6 py-4 text-sm text-gray-500">
											{formatDistanceToNow(new Date(article.created_at), {
												addSuffix: true,
												locale: zhCN,
											})}
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<Link
												href={`/admin/edit/${article.id}`}
												className="text-blue-600 hover:text-blue-900 mr-4"
											>
												编辑
											</Link>
											{article.published && (
												<Link
													href={`/articles/${article.slug}`}
													className="text-gray-600 hover:text-gray-900"
												>
													查看
												</Link>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
}
