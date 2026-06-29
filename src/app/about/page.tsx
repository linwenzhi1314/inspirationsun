import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
	title: '关于我 - 混沌中的探路者',
	description: '我靠直觉赚过钱，也用逻辑赔过钱。最终我发现，真正的自洽不是二选一，而是让敏感和理性在混沌中共舞。',
};

// 使用 ISR，每 60 秒重新验证
export const revalidate = 60;

const supabaseUrl = process.env.COZE_SUPABASE_URL!;
const supabaseAnonKey = process.env.COZE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AboutContent {
	title?: string;
	subtitle?: string;
	description?: string;
	sections?: Array<{
		icon: string;
		title: string;
		content: string;
	}>;
	contact?: {
		email?: string;
		wechat?: string;
		twitter?: string;
		website?: string;
	};
	cta?: {
		text: string;
		link: string;
	};
	customHtml?: string;
}

async function getAboutContent(): Promise<AboutContent | null> {
	try {
		const { data, error } = await supabase
			.from('settings')
			.select('value')
			.eq('key', 'page_about')
			.single();

		if (error || !data) {
			return null;
		}

		return JSON.parse(data.value);
	} catch {
		return null;
	}
}

export default async function AboutPage() {
	const content = await getAboutContent();

	// 如果有自定义 HTML，直接渲染
	if (content?.customHtml) {
		return (
			<div className="min-h-screen bg-white">
				<header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
					<div className="max-w-4xl mx-auto px-6 py-8">
						<div className="flex items-center justify-between">
							<Link href={content?.cta?.link || '/'} className="text-xl font-bold hover:text-gray-300 transition-colors">
								混沌中的探路者
							</Link>
							<nav className="flex gap-6">
								<Link href={content?.cta?.link || '/'} className="text-gray-300 hover:text-white transition-colors">首页</Link>
								<Link href="/about" className="text-white font-medium">关于我</Link>
							</nav>
						</div>
					</div>
				</header>
				<main className="max-w-3xl mx-auto px-6 py-16">
					<div dangerouslySetInnerHTML={{ __html: content.customHtml }} />
				</main>
			</div>
		);
	}

	// 默认内容
	return (
		<div className="min-h-screen bg-white">
			{/* 头部导航 */}
			<header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<Link href={content?.cta?.link || '/'} className="text-xl font-bold hover:text-gray-300 transition-colors">
							混沌中的探路者
						</Link>
						<nav className="flex gap-6">
							<Link
								href={content?.cta?.link || '/'}
								className="text-gray-300 hover:text-white transition-colors"
							>
								首页
							</Link>
							<Link
								href="/about"
								className="text-white font-medium"
							>
								关于我
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* 主要内容 */}
			<main className="max-w-3xl mx-auto px-6 py-16">
				{/* 核心定位 */}
				<div className="mb-16">
					<h1 className="text-4xl font-bold text-gray-900 mb-6">
						{content?.title || '关于我'}
					</h1>
					<div className="bg-gray-50 rounded-lg p-8 border-l-4 border-blue-500">
						<p className="text-xl text-gray-800 leading-relaxed italic">
							{content?.subtitle || '我靠直觉赚过钱，也用逻辑赔过钱。最终我发现，真正的自洽不是二选一，而是让敏感和理性在混沌中共舞。'}
						</p>
					</div>
				</div>

				{/* 动态渲染 sections */}
				{content?.sections?.map((section, index) => (
					<div key={index} className="mb-16">
						<div className="flex items-center gap-3 mb-6">
							{section.icon && <span className="text-3xl">{section.icon}</span>}
							<h2 className="text-2xl font-bold text-gray-900">
								{section.title}
							</h2>
						</div>
						<div className="prose prose-lg text-gray-700">
							<div className="whitespace-pre-wrap">{section.content}</div>
						</div>
					</div>
				))}

			{/* 联系方式 */}
			<div className="mb-16">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					联系方式
				</h2>
				<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div className="flex items-center gap-3">
							<span className="text-2xl">📧</span>
							<div>
								<h3 className="font-semibold text-gray-900">邮箱</h3>
								<p className="text-gray-600 text-sm">
									{content?.contact?.email || 'linwenzhi1314@gmail.com'}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-2xl">💬</span>
							<div>
								<h3 className="font-semibold text-gray-900">微信</h3>
								<p className="text-gray-600 text-sm">
									{content?.contact?.wechat || 'linwenzhi1314'}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-2xl">🐦</span>
							<div>
								<h3 className="font-semibold text-gray-900">Twitter/X</h3>
								<p className="text-gray-600 text-sm">
									{content?.contact?.twitter ? (
										<a href={content.contact.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
											@{content.contact.twitter.replace('https://x.com/', '').replace('https://twitter.com/', '')}
										</a>
									) : (
										<span>未设置</span>
									)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-2xl">🌐</span>
							<div>
								<h3 className="font-semibold text-gray-900">网站</h3>
								<p className="text-gray-600 text-sm">
									{content?.contact?.website ? (
										<a href={content.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
											{content.contact.website.replace('https://', '').replace('http://', '').replace(/\/$/, '')}
										</a>
									) : (
										<a href="https://inspirationsun.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
											inspirationsun.com
										</a>
									)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

				{/* CTA */}
				<div className="text-center">
					<div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg p-8 text-white">
						<h2 className="text-2xl font-bold mb-4">
							{content?.cta?.text || '让我们一起，在混沌中起舞'}
						</h2>
						<p className="text-gray-300 mb-6">
							如果你也是那个"既敏感又理性，既直觉又系统"的人，欢迎来到这里。
						</p>
						<Link
							href={content?.cta?.link || '/'}
							className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
						>
							开始探索
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
