import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '混沌直觉的系统化生存',
    template: '%s | inspirationsun',
  },
  description:
    '用多学科之眼，翻译混沌世界；用实战之躯，验证底层规律。一个高敏感跨界者的认知实验手册。',
  keywords: [
    '混沌直觉',
    '跨界思维',
    '认知实验',
    '系统化生存',
    '高敏感',
    'inspirationsun',
  ],
  authors: [{ name: 'inspirationsun' }],
  generator: 'Next.js',
  openGraph: {
    title: '混沌直觉的系统化生存',
    description:
      '用多学科之眼，翻译混沌世界；用实战之躯，验证底层规律。',
    siteName: 'inspirationsun',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
