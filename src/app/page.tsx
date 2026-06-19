import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const metadata: Metadata = {
	title: '我的个人博客 - 分享思考与技术',
	description: '一个专注于分享技术见解和个人成长的空间',
};

interface Article {
	id: number;
	title: string;
	slug: string;
	excerpt: string | null;
	cover_image: string | null;
	published: boolean;
	created_at: string;
	updated_at: string;
}

async function getArticles(): Promise<Article[]> {
	try {
		const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || `http://localhost:${process.env.DEPLOY_RUN_PORT || 5000}`;
		const protocol = baseUrl.startsWith('http') ? '' : 'https://';
		const res = await fetch(`${protocol}${baseUrl}/api/articles`, {
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

export default async function Home() {
	const articles = await getArticles();

	return (
		<div className="min-h-screen bg-white">
			{/* 头部导航 */}
			<header className="border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								我的博客
							</h1>
							<p className="text-gray-600 mt-1">
								分享思考与技术
							</p>
						</div>
						<nav className="flex gap-6">
							<Link
								href="/"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								首页
							</Link>
							<Link
								href="/admin"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								管理
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* 主要内容 */}
			<main className="max-w-4xl mx-auto px-6 py-12">
				{articles.length === 0 ? (
					<div className="text-center py-20">
						<div className="text-gray-400 text-lg">
							还没有发布任何文章
						</div>
						<p className="text-gray-500 mt-2">
							敬请期待...
						</p>
					</div>
				) : (
					<div className="space-y-8">
						{articles.map((article) => (
							<article
								key={article.id}
								className="group border-b border-gray-100 pb-8 last:border-0"
							>
								<Link href={`/articles/${article.slug}`}>
									{article.cover_image && (
										<div className="mb-4 overflow-hidden rounded-lg">
											<img
												src={article.cover_image}
												alt={article.title}
												className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
									)}
									<h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
										{article.title}
									</h2>
									{article.excerpt && (
										<p className="text-gray-600 mt-2 line-clamp-2">
											{article.excerpt}
										</p>
									)}
									<div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
										<time>
											{formatDistanceToNow(new Date(article.created_at), {
												addSuffix: true,
												locale: zhCN,
											})}
										</time>
									</div>
								</Link>
							</article>
						))}
					</div>
				)}
			</main>

			{/* 页脚 */}
			<footer className="border-t border-gray-200 mt-20">
				<div className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-500">
					<p>© 2024 我的博客. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
