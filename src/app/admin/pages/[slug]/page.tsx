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
      title: '混沌中的探路者',
      subtitle: '用敏感捕捉信号，用跨界解码规律',
      description: '用实战之躯，验证底层规律',
      sections: [
        {
          icon: '🌊',
          title: '高敏感体质',
          content: '捕捉别人忽略的"信号"——气场、情绪、能量波动'
        },
        {
          icon: '🔮',
          title: '跨界整合者',
          content: '融合物理、心理、行为经济学的"元认知"框架'
        },
        {
          icon: '⚡',
          title: '直觉逆袭者',
          content: '混沌直觉+系统验证，在实战中赚到过钱'
        }
      ],
      cta: {
        text: '混沌直觉的系统化生存——一个高敏感跨界者的认知实验手册',
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
