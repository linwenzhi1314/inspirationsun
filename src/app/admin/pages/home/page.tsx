'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Layer {
	icon: string;
	title: string;
	description: string;
}

interface HomeContent {
	title: string;
	tagline: string;
	subtitle: string;
	description: string;
	layers: Layer[];
}

const defaultContent: HomeContent = {
	title: '混沌中的探路者',
	tagline: '用敏感捕捉信号，用跨界解码规律',
	subtitle: '用实战之躯，验证底层规律',
	description: '混沌直觉的系统化生存——一个高敏感跨界者的认知实验手册',
	layers: [
		{ icon: '🌊', title: '高敏感体质', description: '能捕捉到别人忽略的信号' },
		{ icon: '🔮', title: '跨界整合者', description: '融合物理、心理、行为经济学的"元认知"框架' },
		{ icon: '⚡', title: '直觉逆袭者', description: '混沌直觉+系统验证，在实战中赚到过钱' },
	],
};

export default function EditHomePage() {
	const router = useRouter();
	const [content, setContent] = useState<HomeContent>(defaultContent);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		loadContent();
	}, []);

	const loadContent = async () => {
		try {
			const res = await fetch('/api/admin/pages/home');
			if (res.ok) {
				const data = await res.json();
				if (data.content) {
					setContent(JSON.parse(data.content));
				}
			}
		} catch (error) {
			console.error('加载内容失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		setMessage('');

		try {
			const res = await fetch('/api/admin/pages/home', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: JSON.stringify(content) }),
			});

			if (res.ok) {
				setMessage('保存成功！');
				setTimeout(() => setMessage(''), 3000);
			} else {
				setMessage('保存失败');
			}
		} catch (error) {
			console.error('保存失败:', error);
			setMessage('保存失败');
		} finally {
			setSaving(false);
		}
	};

	const handleReset = () => {
		if (confirm('确定要恢复默认内容吗？')) {
			setContent(defaultContent);
		}
	};

	const updateLayer = (index: number, field: keyof Layer, value: string) => {
		const newLayers = [...content.layers];
		newLayers[index] = { ...newLayers[index], [field]: value };
		setContent({ ...content, layers: newLayers });
	};

	const addLayer = () => {
		setContent({
			...content,
			layers: [...content.layers, { icon: '✨', title: '', description: '' }],
		});
	};

	const removeLayer = (index: number) => {
		if (confirm('确定要删除这个层次吗？')) {
			setContent({
				...content,
				layers: content.layers.filter((_, i) => i !== index),
			});
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-500">加载中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 顶部导航 */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link href="/admin" className="text-gray-600 hover:text-gray-900">
								← 返回后台
							</Link>
							<h1 className="text-xl font-bold text-gray-900">编辑首页</h1>
						</div>
						<div className="flex gap-3">
							<button
								onClick={handleReset}
								className="px-4 py-2 text-gray-600 hover:text-gray-900"
							>
								恢复默认
							</button>
							<button
								onClick={handleSave}
								disabled={saving}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
							>
								{saving ? '保存中...' : '保存'}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* 主要内容 */}
			<main className="max-w-4xl mx-auto px-6 py-8">
				{message && (
					<div className={`mb-6 p-4 rounded-lg ${message === '保存成功！' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
						{message}
					</div>
				)}

				{/* 基本信息 */}
				<section className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
					
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								网站标题
							</label>
							<input
								type="text"
								value={content.title}
								onChange={(e) => setContent({ ...content, title: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="混沌中的探路者"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								核心标语
							</label>
							<input
								type="text"
								value={content.tagline}
								onChange={(e) => setContent({ ...content, tagline: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="用敏感捕捉信号，用跨界解码规律"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								副标题
							</label>
							<input
								type="text"
								value={content.subtitle}
								onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="用实战之躯，验证底层规律"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								定位描述
							</label>
							<input
								type="text"
								value={content.description}
								onChange={(e) => setContent({ ...content, description: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="混沌直觉的系统化生存——一个高敏感跨界者的认知实验手册"
							/>
						</div>
					</div>
				</section>

				{/* 三个层次 */}
				<section className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900">三个层次</h2>
						<button
							onClick={addLayer}
							className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
						>
							+ 添加层次
						</button>
					</div>

					<div className="space-y-4">
						{content.layers.map((layer, index) => (
							<div key={index} className="border border-gray-200 rounded-lg p-4">
								<div className="flex items-start gap-4">
									<div className="w-16">
										<label className="block text-xs text-gray-500 mb-1">图标</label>
										<input
											type="text"
											value={layer.icon}
											onChange={(e) => updateLayer(index, 'icon', e.target.value)}
											className="w-full px-2 py-1 text-center text-2xl border border-gray-300 rounded"
										/>
									</div>
									<div className="flex-1">
										<div className="mb-2">
											<label className="block text-xs text-gray-500 mb-1">标题</label>
											<input
												type="text"
												value={layer.title}
												onChange={(e) => updateLayer(index, 'title', e.target.value)}
												className="w-full px-3 py-1 border border-gray-300 rounded"
												placeholder="层次标题"
											/>
										</div>
										<div>
											<label className="block text-xs text-gray-500 mb-1">描述</label>
											<textarea
												value={layer.description}
												onChange={(e) => updateLayer(index, 'description', e.target.value)}
												className="w-full px-3 py-1 border border-gray-300 rounded"
												rows={2}
												placeholder="层次描述"
											/>
										</div>
									</div>
									<button
										onClick={() => removeLayer(index)}
										className="text-red-500 hover:text-red-700"
									>
										删除
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
