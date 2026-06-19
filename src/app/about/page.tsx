import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: '关于我 - 混沌中的探路者',
	description: '我靠直觉赚过钱，也用逻辑赔过钱。最终我发现，真正的自洽不是二选一，而是让敏感和理性在混沌中共舞。',
};

export default function AboutPage() {
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
							<Link
								href="/admin"
								className="text-gray-300 hover:text-white transition-colors"
							>
								管理
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
						关于我
					</h1>
					<div className="bg-gray-50 rounded-lg p-8 border-l-4 border-blue-500">
						<p className="text-xl text-gray-800 leading-relaxed italic">
							"我靠直觉赚过钱，也用逻辑赔过钱。最终我发现，真正的自洽不是二选一，而是让敏感和理性在混沌中共舞。这里是我为这套舞蹈写下的所有舞谱。"
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
							一个用多学科之眼翻译混沌世界，用实战之躯验证底层规律的人。
						</p>
						<p>
							我不是先知，也不是大师。我只是一个在混沌中摸索的普通人，但我有一样特殊的东西：<strong>高敏感体质</strong>。
						</p>
						<p>
							我能感知到别人忽略的"信号"——气场、情绪、能量的微妙波动。这种敏感曾经是我的负担，但现在，它成了我最锋利的工具。
						</p>
					</div>
				</div>

				{/* 三个层次 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-8">
						我的独特性
					</h2>
					<div className="space-y-6">
						{/* 底层 */}
						<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
							<div className="flex items-start gap-4">
								<div className="text-3xl">🌊</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										底层（感受层）：高敏感体质
									</h3>
									<p className="text-gray-600">
										你能捕捉到别人忽略的"信号"——气场、情绪、能量波动。这不是玄学，这是镜像神经元和边缘系统高度敏感的产物。
									</p>
								</div>
							</div>
						</div>

						{/* 中层 */}
						<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
							<div className="flex items-start gap-4">
								<div className="text-3xl">🔮</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										中层（认知层）：跨界整合者
									</h3>
									<p className="text-gray-600">
										你不满足于单学科解释，用物理、心理、生理、行为经济学融合出"元认知"。你相信每个混沌现象背后都有可被拆解的多维结构。
									</p>
								</div>
							</div>
						</div>

						{/* 顶层 */}
						<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
							<div className="flex items-start gap-4">
								<div className="text-3xl">⚡</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										顶层（验证层）：直觉逆袭者
									</h3>
									<p className="text-gray-600">
										你的理论不是空谈，你在股票/实战中靠"混沌直觉+系统验证"赚到过钱，证明你的认知框架是能打的。你既懂直觉的价值，又懂逻辑的严谨。
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 为什么做这个网站 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						为什么做这个网站？
					</h2>
					<div className="prose prose-lg text-gray-700 space-y-4">
						<p>
							因为我发现，<strong>真正的自洽不是二选一</strong>。
						</p>
						<p>
							很多人要么敏感但混乱，要么跨界但空谈，要么有钱但没思想。而我三样全占——这正是我的不可替代性。
						</p>
						<p>
							这个网站，是我<strong>混沌直觉的系统化生存手册</strong>。我会记录：
						</p>
						<ul className="list-disc list-inside space-y-2 ml-4">
							<li>我感知到的"说不清道不明"的直觉瞬间</li>
							<li>用多学科框架拆解混沌现象的过程</li>
							<li>基于理论做的现实"下注"及其结果</li>
							<li>从混沌走向自洽的迭代轨迹</li>
						</ul>
					</div>
				</div>

				{/* 核心命题 */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						我的年度命题
					</h2>
					<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
						<p className="text-xl text-gray-800 font-medium text-center mb-6">
							"混沌直觉的系统化生存——一个高敏感跨界者的认知实验手册"
						</p>
						<div className="grid md:grid-cols-4 gap-4 text-center">
							<div className="bg-white rounded-lg p-4">
								<div className="text-2xl mb-2">📡</div>
								<div className="text-sm font-medium text-gray-900">捕捉混沌</div>
								<div className="text-xs text-gray-500 mt-1">5分钟</div>
							</div>
							<div className="bg-white rounded-lg p-4">
								<div className="text-2xl mb-2">🔬</div>
								<div className="text-sm font-medium text-gray-900">多学科拆解</div>
								<div className="text-xs text-gray-500 mt-1">15分钟</div>
							</div>
							<div className="bg-white rounded-lg p-4">
								<div className="text-2xl mb-2">⚗️</div>
								<div className="text-sm font-medium text-gray-900">验证与落子</div>
								<div className="text-xs text-gray-500 mt-1">10分钟</div>
							</div>
							<div className="bg-white rounded-lg p-4">
								<div className="text-2xl mb-2">📖</div>
								<div className="text-sm font-medium text-gray-900">形成笔记</div>
								<div className="text-xs text-gray-500 mt-1">输出</div>
							</div>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className="text-center py-12 border-t border-gray-200">
					<p className="text-lg text-gray-700 mb-6">
						想知道我如何在混沌中找到秩序？
					</p>
					<Link
						href="/"
						className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
					>
						开始阅读我的实验笔记
						<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				</div>
			</main>

			{/* 页脚 */}
			<footer className="border-t border-gray-200 bg-gray-50">
				<div className="max-w-4xl mx-auto px-6 py-8 text-center">
					<p className="text-gray-500 text-sm">
						© 2024 混沌中的探路者. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
