import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 验证登录状态
    const cookieStore = await cookies();
    const authSession = cookieStore.get('admin_auth');
    
    if (!authSession || authSession.value !== 'true') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: '请提供当前密码和新密码' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少需要 6 个字符' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 从数据库获取当前密码
    const { data: result, error: fetchError } = await client
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('获取密码失败:', fetchError);
      return NextResponse.json({ error: '获取密码失败' }, { status: 500 });
    }

    const storedPassword = result?.value || 'admin123';

    // 验证当前密码
    if (currentPassword !== storedPassword) {
      return NextResponse.json({ error: '当前密码错误' }, { status: 400 });
    }

    // 更新密码
    const { error: updateError } = await client
      .from('settings')
      .upsert({
        key: 'admin_password',
        value: newPassword,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('更新密码失败:', updateError);
      return NextResponse.json({ error: '更新密码失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    return NextResponse.json({ error: '修改密码失败' }, { status: 500 });
  }
}
