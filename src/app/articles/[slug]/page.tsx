import { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { notFound } from 'next/navigation';

interface Article {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string | null;
	cover_image: string | null;
	published: boolean;
	created_at: string;
	updated_at: string;
	twitter_post_id: string | null;
	twitter_posted_at: string | null;
}

async function getArticle(slug: string): Promise<Article | null> {
	try {
		const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || `http://localhost:${process.env.DEPLOY_RUN_PORT || 5000}`;
		const protocol = baseUrl.startsWith('http') ? '' : 'https://';
		const res = await fetch(`${protocol}${baseUrl}/api/articles/${slug}`, {
			cache: 'no-store',
		});

		if (!res.ok) {
			return null;
		}

		const data = await res.json();
		return data.article;
	} catch (error) {
		console.error('获取文章错误:', error);
		return null;
	}
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const article = await getArticle(slug);

	if (!article) {
		return {
			title: '文章不存在',
		};
	}

	return {
		title: `${article.title} - 我的博客`,
		description: article.excerpt || article.content.substring(0, 160),
	};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const article = await getArticle(slug);

	if (!article) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-white">
			{/* 头部导航 */}
			<header className="border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<div>
							<Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
								我的博客
							</Link>
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

			{/* 文章内容 */}
			<main className="max-w-3xl mx-auto px-6 py-12">
				<article>
					{/* 文章标题 */}
					<header className="mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							{article.title}
						</h1>
						<div className="flex items-center gap-4 text-sm text-gray-500">
							<time>
								{format(new Date(article.created_at), 'PPP', { locale: zhCN })}
							</time>
							{article.twitter_post_id && (
								<span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs">
									已同步到 X
								</span>
							)}
						</div>
					</header>

					{/* 封面图 */}
					{article.cover_image && (
						<div className="mb-8 overflow-hidden rounded-lg">
							<img
								src={article.cover_image}
								alt={article.title}
								className="w-full h-auto"
							/>
						</div>
					)}

					{/* 文章正文 */}
					<div className="prose prose-lg max-w-none">
						<div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
							{article.content}
						</div>
					</div>
				</article>

				{/* 返回链接 */}
				<div className="mt-12 pt-8 border-t border-gray-200">
					<Link
						href="/"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
					>
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						返回文章列表
					</Link>
				</div>
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
