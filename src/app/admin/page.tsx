import { Metadata } from 'next';
import Link from 'next/link';
import { ArticleList } from '@/components/admin/ArticleList';

export const metadata: Metadata = {
	title: '管理后台 - 我的博客',
	description: '文章管理系统',
};

export default function AdminPage() {
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
				<ArticleList />
			</main>
		</div>
	);
}
