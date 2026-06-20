import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword } from '@/lib/password-manager';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // 获取管理员密码（自动选择最佳方式）
    const adminPassword = await getAdminPassword();
    
    if (password === adminPassword) {
      // 创建响应并设置 cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 天
      });
      return response;
    }
    
    return NextResponse.json(
      { error: '密码错误' },
      { status: 401 }
    );
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: `登录失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}
