/**
 * 文章分类配置
 */

export type ArticleCategory =
  | 'signal_capture'    // 信号捕捉
  | 'cross_decode'      // 跨界解码
  | 'cognitive_experiment' // 认知实验
  | 'self_consistent';  // 自洽手记

export interface CategoryConfig {
  key: ArticleCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const ARTICLE_CATEGORIES: CategoryConfig[] = [
  {
    key: 'signal_capture',
    label: '信号捕捉',
    description: '记录我感知到的"说不清道不明"的直觉瞬间',
    icon: '📡',
    color: 'blue',
  },
  {
    key: 'cross_decode',
    label: '跨界解码',
    description: '用≥2个学科框架拆解一个混沌现象',
    icon: '🔬',
    color: 'purple',
  },
  {
    key: 'cognitive_experiment',
    label: '认知实验',
    description: '记录我基于理论做的一个现实"下注"及其结果',
    icon: '⚗️',
    color: 'green',
  },
  {
    key: 'self_consistent',
    label: '自洽手记',
    description: '每月一篇复盘——我如何从混沌走向自洽的迭代轨迹',
    icon: '📖',
    color: 'orange',
  },
];

export const getCategoryConfig = (category: ArticleCategory): CategoryConfig => {
  return ARTICLE_CATEGORIES.find(c => c.key === category) || ARTICLE_CATEGORIES[0];
};
