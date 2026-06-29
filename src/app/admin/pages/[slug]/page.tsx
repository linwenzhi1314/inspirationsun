'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageContent {
  title?: string;
  subtitle?: string;
  description?: string;
  sections?: Array<{
    icon: string;
    title: string;
    content: string;
  }>;
  cta?: {
    text: string;
    link: string;
  };
}

const PAGE_CONFIG: Record<string, { name: string; defaultContent: PageContent }> = {
  about: {
    name: '关于我',
    defaultContent: {
      title: '关于我',
      subtitle: '我靠直觉赚过钱，也用逻辑赔过钱。最终我发现，真正的自洽不是二选一，而是让敏感和理性在混沌中共舞。',
      description: '这里是我为这套舞蹈写下的所有舞谱。',
      sections: [
        {
          icon: '👤',
          title: '我是谁？',
          content: '一个用多学科之眼翻译混沌世界，用实战之躯验证底层规律的人。\n\n我不是先知，也不是大师。我只是一个在混沌中摸索的普通人，但我有一样特殊的东西：**高敏感体质**。\n\n我能感知到别人忽略的"信号"——气场、情绪、能量的微妙波动。这种敏感曾经是我的负担，但现在，它成了我最锋利的工具。\n\n我不会被单一标签束缚，因为我想要的是，多学科的融合，我只把自己定位为一名**学者**。'
        },
        {
          icon: '🌊',
          title: '底层（感受层）：高敏感体质',
          content: '你能捕捉到别人忽略的"信号"——气场、情绪、能量波动。这不是玄学，这是镜像神经元和边缘系统高度敏感的产物。'
        },
        {
          icon: '🔮',
          title: '中层（认知层）：跨界整合者',
          content: '你不满足于单学科解释，用物理、心理、生理、行为经济学融合出"元认知"。你相信每个混沌现象背后都有可被拆解的多维结构。'
        },
        {
          icon: '⚡',
          title: '顶层（验证层）：直觉逆袭者',
          content: '你的理论不是空谈，你在股票/实战中靠"混沌直觉+系统验证"赚到过钱，证明你的认知框架是能打的。你既懂直觉的价值，又懂逻辑的严谨。'
        },
        {
          icon: '📝',
          title: '我的案例',
          content: '**公众号：林生观天下**\n主题：关于写国家政策，产业经济的内容\n\n**音乐创作：《规矩》《我就这样》**\n用AI创作属于自己的音乐\n\n**项目：AI创业项目搜索插件**\n网站：aistartupscout.com，AI创业项目智能分析师\n\n**未完待续...**'
        },
        {
          icon: '📚',
          title: '我的经历',
          content: '**看过的书**\n艾菲《直击本质》、《道德经》、《素书》、《孙子兵法》.....\n\n**走过的路**\n重庆、荆州、潮州、福州、泉州、厦门、莆田\n\n**看过的风景**\n三峡、武当山、湄洲岛'
        },
        {
          icon: '📬',
          title: '我的联系方式',
          content: '**邮箱**\nlinwenzhi1314@gmail.com\n\n**微信**\nlinwenzhi1314\n\n**Twitter/X**\n@linwenzhi1314\n\n**网站**\ninspirationsun.com'
        }
      ],
      cta: {
        text: '让我们一起，在混沌中起舞',
        link: '/'
      }
    }
  }
};

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const config = PAGE_CONFIG[slug];
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<PageContent>(config?.defaultContent || {});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!config) {
      router.push('/admin');
      return;
    }
    
    // 从数据库加载内容
    fetch(`/api/admin/pages/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          try {
            setContent(JSON.parse(data.content));
          } catch {
            setContent(config.defaultContent);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setContent(config.defaultContent);
        setLoading(false);
      });
  }, [slug, config, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: JSON.stringify(content) })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '保存成功！' });
      } else {
        setMessage({ type: 'error', text: data.error || '保存失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('确定要恢复默认内容吗？')) {
      setContent(config.defaultContent);
    }
  };

  if (!config) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              编辑「{config.name}」页面
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* 基本信息 */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                value={content.title || ''}
                onChange={e => setContent({ ...content, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                副标题
              </label>
              <input
                type="text"
                value={content.subtitle || ''}
                onChange={e => setContent({ ...content, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <input
                type="text"
                value={content.description || ''}
                onChange={e => setContent({ ...content, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* 特色卡片 */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">特色卡片</h2>
          
          <div className="space-y-4">
            {content.sections?.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      图标
                    </label>
                    <input
                      type="text"
                      value={section.icon}
                      onChange={e => {
                        const newSections = [...(content.sections || [])];
                        newSections[index] = { ...section, icon: e.target.value };
                        setContent({ ...content, sections: newSections });
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-[3]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      标题
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={e => {
                        const newSections = [...(content.sections || [])];
                        newSections[index] = { ...section, title: e.target.value };
                        setContent({ ...content, sections: newSections });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内容
                  </label>
                  <textarea
                    value={section.content}
                    onChange={e => {
                      const newSections = [...(content.sections || [])];
                      newSections[index] = { ...section, content: e.target.value };
                      setContent({ ...content, sections: newSections });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">行动号召</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文案
              </label>
              <textarea
                value={content.cta?.text || ''}
                onChange={e => setContent({ 
                  ...content, 
                  cta: { ...content.cta!, text: e.target.value } 
                })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                链接
              </label>
              <input
                type="text"
                value={content.cta?.link || ''}
                onChange={e => setContent({ 
                  ...content, 
                  cta: { ...content.cta!, link: e.target.value } 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
