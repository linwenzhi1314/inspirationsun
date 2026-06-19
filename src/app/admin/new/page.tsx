'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewArticlePage() {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [content, setContent] = useState('');
	const [excerpt, setExcerpt] = useState('');
	const [coverImage, setCoverImage] = useState('');
	const [published, setPublished] = useState(false);
	const [syncToTwitter, setSyncToTwitter] = useState(false);
	const [loading, setLoading] = useState(false);

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
		if (!slug) {
			setSlug(generateSlug(newTitle));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !slug || !content) {
			alert('请填写标题、链接和内容');
			return;
		}

		setLoading(true);

		try {
			const res = await fetch('/api/admin/articles', {
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
					published,
					sync_to_twitter: syncToTwitter,
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || '保存失败');
			}

			const data = await res.json();

			if (syncToTwitter && published) {
				alert('文章已保存，正在同步到 X...');
			} else {
				alert('文章保存成功');
			}

			router.push('/admin');
		} catch (error) {
			console.error('保存文章错误:', error);
			alert(error instanceof Error ? error.message : '保存失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 头部 */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-6xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">新建文章</h1>
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
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						{/* 标题 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								文章标题 *
							</label>
							<input
								type="text"
								value={title}
								onChange={handleTitleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="输入文章标题"
								required
							/>
						</div>

						{/* Slug */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								链接别名 *
							</label>
							<input
								type="text"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="article-url-slug"
								required
							/>
							<p className="text-sm text-gray-500 mt-1">
								文章链接: /articles/{slug || 'your-slug'}
							</p>
						</div>

						{/* 摘要 */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								文章摘要
							</label>
							<textarea
								value={excerpt}
								onChange={(e) => setExcerpt(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="简要描述文章内容（可选）"
								rows={3}
							/>
						</div>

						{/* 封面图 */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								封面图片 URL
							</label>
							<input
								type="url"
								value={coverImage}
								onChange={(e) => setCoverImage(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="https://example.com/cover.jpg"
							/>
						</div>

						{/* 内容 */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								文章内容 *
							</label>
							<textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
								placeholder="在这里撰写你的文章内容..."
								rows={15}
								required
							/>
						</div>
					</div>

					{/* 发布选项 */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-sm font-medium text-gray-900">发布设置</h3>
								<p className="text-sm text-gray-500 mt-1">
									选择是否立即发布文章
								</p>
							</div>
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={published}
									onChange={(e) => setPublished(e.target.checked)}
									className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className="ml-2 text-sm text-gray-900">
									立即发布
								</span>
							</label>
						</div>

						<div className="mt-4 pt-4 border-t border-gray-200">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-gray-900">同步到 X (Twitter)</h3>
									<p className="text-sm text-gray-500 mt-1">
										发布时自动同步到你的 X 账号
									</p>
								</div>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={syncToTwitter}
										onChange={(e) => setSyncToTwitter(e.target.checked)}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span className="ml-2 text-sm text-gray-900">
										同步到 X
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* 提交按钮 */}
					<div className="flex justify-end gap-4">
						<Link
							href="/admin"
							className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
						>
							取消
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? '保存中...' : '保存文章'}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}
