import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const client = getSupabaseClient();

    // 从数据库获取管理密码
    const { data: result, error: fetchError } = await client
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    let adminPassword = 'admin123';
    if (!fetchError && result?.value) {
      adminPassword = result.value;
    }
    
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
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
