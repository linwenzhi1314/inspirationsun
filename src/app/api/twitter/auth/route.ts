import { NextResponse } from 'next/server';
import { getTwitterAuthUrl } from '@/lib/twitter';

export async function GET() {
  try {
    // 生成随机 state 用于防止 CSRF 攻击
    const state = Math.random().toString(36).substring(7);

    // 获取 Twitter 授权 URL
    const authUrl = getTwitterAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('获取 Twitter 授权 URL 错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取授权链接失败' },
      { status: 500 }
    );
  }
}
