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
	intro?: string;
	whoAmI?: string;
	traits?: Array<{ icon: string; level: string; name: string; description: string }>;
	cases?: Array<{ icon: string; title: string; description: string; link?: string }>;
	experiences?: {
		books?: string;
		places?: string;
		scenery?: string;
	};
	contact?: {
		email?: string;
		wechat?: string;
		twitter?: string;
		website?: string;
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
							<Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
								混沌中的探路者
							</Link>
							<nav className="flex gap-6">
								<Link href="/" className="text-gray-300 hover:text-white transition-colors">首页</Link>
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
						<Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
							混沌中的探路者
						</Link>
						<nav className="flex gap-6">
							<Link
								href="/"
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
							{content?.subtitle || '"我靠直觉赚过钱，也用逻辑赔过钱。最终我发现，真正的自洽不是二选一，而是让敏感和理性在混沌中共舞。这里是我为这套舞蹈写下的所有舞谱。"'}
						</p>
					</div>
				</div>

				{/* 我是谁 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						我是谁？
					</h2>
					<div className="prose prose-lg text-gray-700 space-y-4">
						<p>
							{content?.intro || '一个用多学科之眼翻译混沌世界，用实战之躯验证底层规律的人。'}
						</p>
						<p>
							我不是先知，也不是大师。我只是一个在混沌中摸索的普通人，但我有一样特殊的东西：<strong>高敏感体质</strong>。
						</p>
						<p>
							我能感知到别人忽略的"信号"——气场、情绪、能量的微妙波动。这种敏感曾经是我的负担，但现在，它成了我最锋利的工具。
						</p>
						<p>
							我不会被单一标签束缚，因为我想要的是，多学科的融合，我只把自己定位为一名<strong>学者</strong>。
						</p>
					</div>
				</div>

				{/* 三个层次 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-8">
						我的独特性
					</h2>
					<div className="space-y-6">
						{(content?.traits || [
							{ icon: '🌊', level: '底层（感受层）', name: '高敏感体质', description: '你能捕捉到别人忽略的"信号"——气场、情绪、能量波动。这不是玄学，这是镜像神经元和边缘系统高度敏感的产物。' },
							{ icon: '🔮', level: '中层（认知层）', name: '跨界整合者', description: '你不满足于单学科解释，用物理、心理、生理、行为经济学融合出"元认知"。你相信每个混沌现象背后都有可被拆解的多维结构。' },
							{ icon: '⚡', level: '顶层（验证层）', name: '直觉逆袭者', description: '你的理论不是空谈，你在股票/实战中靠"混沌直觉+系统验证"赚到过钱，证明你的认知框架是能打的。你既懂直觉的价值，又懂逻辑的严谨。' }
						]).map((trait, index) => (
							<div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
								<div className="flex items-start gap-4">
									<div className="text-3xl">{trait.icon}</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">
											{trait.level}：{trait.name}
										</h3>
										<p className="text-gray-600">
											{trait.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* 我的案例 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						我的案例
					</h2>
					<div className="space-y-4">
						{((content?.cases as Array<{ icon: string; title: string; description: string; color?: string; link?: string }>) || [
							{ icon: '📝', title: '公众号：林生观天下', description: '主题：关于写国家政策，产业经济的内容', color: 'border-purple-500' },
							{ icon: '🎵', title: '音乐创作：《规矩》《我就这样》', description: '用AI创作属于自己的音乐', color: 'border-pink-500' },
							{ icon: '🚀', title: '项目：AI创业项目搜索插件', description: '网站：aistartupscout.com，AI创业项目智能分析师', link: 'https://aistartupscout.com', color: 'border-green-500' },
							{ icon: '✨', title: '未完待续...', description: '', color: 'border-gray-400' }
						]).map((caseItem, index) => (
							<div key={index} className={`bg-gray-50 rounded-lg p-6 border-l-4 ${caseItem.color || 'border-blue-500'}`}>
								<div className="flex items-start gap-3">
									<span className="text-2xl">{caseItem.icon}</span>
									<div>
										<h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
										<p className="text-gray-600 text-sm mt-1">
											{caseItem.description}
											{caseItem.link && (
												<>
													{' '}
													<a href={caseItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
														{caseItem.link}
													</a>
												</>
											)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* 我的经历 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						我的经历
					</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6">
							<div className="text-3xl mb-3">📚</div>
							<h3 className="font-semibold text-gray-900 mb-3">看过的书</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								{content?.experiences?.books || '艾菲《直击本质》、《道德经》、《素书》、《孙子兵法》.....'}
							</p>
						</div>
						<div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
							<div className="text-3xl mb-3">🛤️</div>
							<h3 className="font-semibold text-gray-900 mb-3">走过的路</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								{content?.experiences?.places || '重庆、荆州、潮州、福州、泉州、厦门、莆田'}
							</p>
						</div>
						<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
							<div className="text-3xl mb-3">🏔️</div>
							<h3 className="font-semibold text-gray-900 mb-3">看过的风景</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								{content?.experiences?.scenery || '三峡、武当山、湄洲岛'}
							</p>
						</div>
					</div>
				</div>

			{/* 我的联系方式 */}
			<div className="mb-16">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					我的联系方式
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
									<a href={content?.contact?.twitter || 'https://x.com/linwenzhi1314'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
										@linwenzhi1314
									</a>
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-2xl">🌐</span>
							<div>
								<h3 className="font-semibold text-gray-900">网站</h3>
								<p className="text-gray-600 text-sm">
									<a href={content?.contact?.website || 'https://inspirationsun.com'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
										inspirationsun.com
									</a>
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
							让我们一起，在混沌中起舞
						</h2>
						<p className="text-gray-300 mb-6">
							如果你也是那个"既敏感又理性，既直觉又系统"的人，欢迎来到这里。
						</p>
						<Link
							href="/"
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
