import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ARTICLE_CATEGORIES, getCategoryConfig, type ArticleCategory } from '@/lib/constants';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// ISR: 每 60 秒自动重新生成页面，让首页能自动显示最新的文章更新
export const revalidate = 60;

export const metadata: Metadata = {
	title: '混沌中的探路者 - 用敏感捕捉信号，用跨界解码规律',
	description: '用多学科之眼，翻译混沌世界；用实战之躯，验证底层规律。',
};

interface Article {
	id: number;
	title: string;
	slug: string;
	excerpt: string | null;
	cover_image: string | null;
	category: ArticleCategory;
	published: boolean;
	created_at: string;
	updated_at: string;
}

async function getArticles(): Promise<Article[]> {
	try {
		// 直接使用 Supabase Client 获取已发布文章
		const client = getSupabaseClient();
		const { data, error } = await client
			.from('articles')
			.select('id, title, slug, excerpt, cover_image, category, published, created_at, updated_at')
			.eq('published', true)
			.order('created_at', { ascending: false })
			.limit(20);

		if (error) {
			console.error('获取文章错误:', error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error('获取文章错误:', error);
		return [];
	}
}

export default async function Home() {
	const articles = await getArticles();

	// 按分类组织文章
	const articlesByCategory = ARTICLE_CATEGORIES.reduce((acc, cat) => {
		acc[cat.key] = articles.filter(a => a.category === cat.key).slice(0, 3);
		return acc;
	}, {} as Record<ArticleCategory, Article[]>);

	return (
		<div className="min-h-screen bg-white">
			{/* 英雄区域 - 核心定位 */}
			<header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
				<div className="max-w-5xl mx-auto px-6 py-20">
					{/* 顶部导航 */}
					<nav className="flex items-center justify-between mb-16">
						<div className="text-xl font-bold">混沌中的探路者</div>
						<div className="flex gap-6">
							<Link href="/" className="text-gray-300 hover:text-white transition-colors">
								首页
							</Link>
							<Link href="/about" className="text-gray-300 hover:text-white transition-colors">
								关于我
							</Link>
						</div>
					</nav>

					{/* 核心标语 */}
					<div className="text-center mb-16">
						<h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
							用敏感捕捉信号，用跨界解码规律
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							用实战之躯，验证底层规律
						</p>
						<div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm">
							<span className="mr-2">🎯</span>
							混沌直觉的系统化生存——一个高敏感跨界者的认知实验手册
						</div>
					</div>

					{/* 三个层次展示 */}
					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
							<div className="text-3xl mb-3">🌊</div>
							<h3 className="text-lg font-semibold mb-2">高敏感体质</h3>
							<p className="text-gray-400 text-sm">
								捕捉别人忽略的"信号"——气场、情绪、能量波动
							</p>
						</div>
						<div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
							<div className="text-3xl mb-3">🔮</div>
							<h3 className="text-lg font-semibold mb-2">跨界整合者</h3>
							<p className="text-gray-400 text-sm">
								融合物理、心理、行为经济学的"元认知"框架
							</p>
						</div>
						<div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
							<div className="text-3xl mb-3">⚡</div>
							<h3 className="text-lg font-semibold mb-2">直觉逆袭者</h3>
							<p className="text-gray-400 text-sm">
								混沌直觉+系统验证，在实战中赚到过钱
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* 主要内容 */}
			<main className="max-w-5xl mx-auto px-6 py-16">
				{/* 四个核心栏目 */}
				<div className="mb-20">
					<h2 className="text-2xl font-bold text-gray-900 mb-8">内容栏目</h2>
					<div className="grid md:grid-cols-2 gap-6">
						{ARTICLE_CATEGORIES.map((category) => (
							<Link
								key={category.key}
								href={`/categories/${category.key}`}
								className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200"
							>
								<div className="flex items-start gap-4">
									<div className="text-3xl">{category.icon}</div>
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
											{category.label}
										</h3>
										<p className="text-gray-600 text-sm">
											{category.description}
										</p>
										<div className="mt-3 text-sm text-gray-500">
											{(articlesByCategory[category.key] as Article[]).length} 篇文章
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* 最新文章 */}
				{articles.length > 0 && (
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-8">最新文章</h2>
						<div className="space-y-6">
							{articles.slice(0, 5).map((article) => {
								const categoryConfig = getCategoryConfig(article.category);
								return (
									<article
										key={article.id}
										className="group border-b border-gray-100 pb-6 last:border-0"
									>
										<Link href={`/articles/${article.slug}`}>
											<div className="flex items-start gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<span className="text-sm">{categoryConfig.icon}</span>
														<span className="text-xs text-gray-500">{categoryConfig.label}</span>
													</div>
													<h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
														{article.title}
													</h3>
													{article.excerpt && (
														<p className="text-gray-600 line-clamp-2 mb-2">
															{article.excerpt}
														</p>
													)}
													<time className="text-sm text-gray-500">
														{formatDistanceToNow(new Date(article.created_at), {
															addSuffix: true,
															locale: zhCN,
														})}
													</time>
												</div>
											</div>
										</Link>
									</article>
								);
							})}
						</div>
					</div>
				)}

				{articles.length === 0 && (
					<div className="text-center py-20">
						<div className="text-gray-400 text-lg mb-4">
							还没有发布任何文章
						</div>
						<p className="text-gray-500">
							混沌中的实验即将开始...
						</p>
					</div>
				)}
			</main>

			{/* 页脚 */}
			<footer className="border-t border-gray-200 bg-gray-50">
				<div className="max-w-5xl mx-auto px-6 py-12">
					<div className="text-center mb-8">
						<p className="text-gray-700 font-medium mb-2">
							"我是那个替你把混沌世界翻译成清醒决策的探路者。"
						</p>
						<p className="text-gray-500 text-sm">
							用多学科之眼，翻译混沌世界；用实战之躯，验证底层规律。
						</p>
					</div>
					<div className="flex justify-center gap-8 text-sm text-gray-600">
						<Link href="/" className="hover:text-gray-900 transition-colors">首页</Link>
						<Link href="/about" className="hover:text-gray-900 transition-colors">关于我</Link>
					</div>
					<div className="text-center mt-8 pt-8 border-t border-gray-200">
						<p className="text-gray-500 text-sm">
							© 2024 混沌中的探路者. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
