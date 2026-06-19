'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ARTICLE_CATEGORIES, type ArticleCategory } from '@/lib/constants';

interface Article {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string | null;
	cover_image: string | null;
	category: ArticleCategory;
	published: boolean;
}

export default function EditArticlePage() {
	const router = useRouter();
	const params = useParams();
	const articleId = params.id as string;

	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [content, setContent] = useState('');
	const [excerpt, setExcerpt] = useState('');
	const [coverImage, setCoverImage] = useState('');
	const [category, setCategory] = useState<ArticleCategory>('signal_capture');
	const [published, setPublished] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingArticle, setLoadingArticle] = useState(true);

	// 加载文章数据
	useEffect(() => {
		const fetchArticle = async () => {
			try {
				const res = await fetch(`/api/admin/articles/${articleId}`);
				if (!res.ok) {
					throw new Error('文章不存在');
				}

				const data = await res.json();
				const article: Article = data.article;

				setTitle(article.title);
				setSlug(article.slug);
				setContent(article.content);
				setExcerpt(article.excerpt || '');
				setCoverImage(article.cover_image || '');
				setCategory(article.category);
				setPublished(article.published);
			} catch (error) {
				console.error('加载文章错误:', error);
				alert('文章不存在或加载失败');
				router.push('/admin');
			} finally {
				setLoadingArticle(false);
			}
		};

		if (articleId) {
			fetchArticle();
		}
	}, [articleId, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !slug || !content) {
			alert('请填写标题、链接和内容');
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(`/api/admin/articles/${articleId}`, {
				method: 'PUT',
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
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || '保存失败');
			}

			alert('文章更新成功');
			router.push('/admin');
		} catch (error) {
			console.error('更新文章错误:', error);
			alert(error instanceof Error ? error.message : '保存失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	if (loadingArticle) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-600">加载中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 头部 */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-6xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
						</div>
						<Link
							href="/admin"
							className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							返回列表
						</Link>
					</div>
				</div>
			</header>

			{/* 表单 */}
			<main className="max-w-4xl mx-auto px-6 py-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* 文章分类 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							文章分类
						</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{ARTICLE_CATEGORIES.map((cat) => (
								<button
									key={cat.key}
									type="button"
									onClick={() => setCategory(cat.key)}
									className={`p-4 rounded-lg border-2 text-left transition-all ${
										category === cat.key
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 bg-white hover:border-gray-300'
									}`}
								>
									<div className="flex items-center gap-2">
										<span className="text-2xl">{cat.icon}</span>
										<div>
											<div className="font-medium text-gray-900">{cat.label}</div>
											<div className="text-sm text-gray-500">{cat.description}</div>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* 标题 */}
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
							文章标题 <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="输入文章标题"
							required
						/>
					</div>

					{/* 链接别名 */}
					<div>
						<label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
							链接别名 <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="slug"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="article-url-slug"
							required
						/>
						<p className="text-sm text-gray-500 mt-1">
							用于 URL 中，如：/articles/your-slug
						</p>
					</div>

					{/* 封面图 */}
					<div>
						<label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
							封面图链接
						</label>
						<input
							type="url"
							id="coverImage"
							value={coverImage}
							onChange={(e) => setCoverImage(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="简短描述文章内容（可选）"
						/>
					</div>

					{/* 内容 */}
					<div>
						<label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
							文章内容 <span className="text-red-500">*</span>
						</label>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={15}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
							placeholder="使用 Markdown 格式书写文章内容..."
							required
						/>
					</div>

					{/* 发布选项 */}
					<div className="bg-gray-50 p-4 rounded-lg space-y-3">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="published"
								checked={published}
								onChange={(e) => setPublished(e.target.checked)}
								className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label htmlFor="published" className="ml-2 text-sm text-gray-700">
								立即发布
							</label>
						</div>
						<p className="text-sm text-gray-500">
							取消勾选则保存为草稿，不会在网站上显示
						</p>
					</div>

					{/* 提交按钮 */}
					<div className="flex gap-4">
						<button
							type="submit"
							disabled={loading}
							className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
						>
							{loading ? '保存中...' : '保存修改'}
						</button>
						<button
							type="button"
							onClick={() => router.push('/admin')}
							className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
						>
							取消
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}
