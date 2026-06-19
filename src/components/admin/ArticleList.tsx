'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DeleteButton } from '@/components/admin/DeleteButton';

interface Article {
	id: number;
	title: string;
	slug: string;
	excerpt: string | null;
	category: string;
	published: boolean;
	created_at: string;
	updated_at: string;
	twitter_post_id: string | null;
}

export function ArticleList() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const res = await fetch('/api/admin/articles');
				if (!res.ok) {
					throw new Error('获取文章失败');
				}
				const data = await res.json();
				setArticles(data.articles || []);
			} catch (error) {
				console.error('获取文章错误:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
	}, []);

	if (loading) {
		return (
			<div className="text-center py-20 bg-white rounded-lg border border-gray-200">
				<div className="text-gray-600">加载中...</div>
			</div>
		);
	}

	if (articles.length === 0) {
		return (
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
		);
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
								<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
									{article.category}
								</span>
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
							<td className="px-6 py-4 text-right text-sm font-medium space-x-2">
								<Link
									href={`/admin/edit/${article.id}`}
									className="text-blue-600 hover:text-blue-900"
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
								<DeleteButton
									articleId={article.id}
									articleTitle={article.title}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
