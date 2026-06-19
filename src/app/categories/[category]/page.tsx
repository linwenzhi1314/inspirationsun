import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ARTICLE_CATEGORIES, type ArticleCategory, isValidCategory, getCategoryConfig } from '@/lib/constants';

interface Article {
	id: number;
	title: string;
	slug: string;
	excerpt: string | null;
	category: ArticleCategory;
	created_at: string;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ category: string }>;
}): Promise<Metadata> {
	const { category } = await params;
	
	if (!isValidCategory(category)) {
		return {
			title: '分类不存在',
		};
	}

	const config = getCategoryConfig(category);
	return {
		title: `${config.label} - 混沌直觉的系统化生存`,
		description: config.description,
	};
}

async function getCategoryArticles(category: ArticleCategory): Promise<Article[]> {
	try {
		const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || `http://localhost:${process.env.DEPLOY_RUN_PORT || 5000}`;
		const protocol = baseUrl.startsWith('http') ? '' : 'https://';
		const res = await fetch(`${protocol}${baseUrl}/api/categories/${category}`, {
			cache: 'no-store',
		});

		if (!res.ok) {
			throw new Error('获取文章失败');
		}

		const data = await res.json();
		return data.articles || [];
	} catch (error) {
		console.error('获取分类文章错误:', error);
		return [];
	}
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;

	if (!isValidCategory(category)) {
		notFound();
	}

	const config = getCategoryConfig(category);
	const articles = await getCategoryArticles(category);

	return (
		<div className="min-h-screen bg-white">
			{/* 头部 */}
			<header className="bg-gradient-to-b from-gray-100 to-white py-16">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex items-center gap-3 mb-4">
						<span className="text-4xl">{config.icon}</span>
						<h1 className="text-4xl font-bold text-gray-900">
							{config.label}
						</h1>
					</div>
					<p className="text-gray-600 text-lg max-w-2xl">
						{config.description}
					</p>
					<div className="mt-6">
						<Link
							href="/"
							className="text-blue-600 hover:text-blue-700 transition-colors"
						>
							← 返回首页
						</Link>
					</div>
				</div>
			</header>

			{/* 文章列表 */}
			<main className="max-w-6xl mx-auto px-6 py-12">
				{articles.length === 0 ? (
					<div className="text-center py-20">
						<div className="text-gray-400 text-lg mb-2">
							暂无文章
						</div>
						<p className="text-gray-500">
							该分类下还没有发布任何文章
						</p>
					</div>
				) : (
					<div className="space-y-8">
						{articles.map((article) => (
							<Link
								key={article.id}
								href={`/articles/${article.slug}`}
								className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<h2 className="text-xl font-semibold text-gray-900 mb-2">
									{article.title}
								</h2>
								{article.excerpt && (
									<p className="text-gray-600 mb-3">
										{article.excerpt}
									</p>
								)}
								<div className="text-sm text-gray-500">
									{formatDistanceToNow(new Date(article.created_at), {
										addSuffix: true,
										locale: zhCN,
									})}
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

// 生成静态参数
export async function generateStaticParams() {
	return ARTICLE_CATEGORIES.map((category) => ({
		category: category.key,
	}));
}
