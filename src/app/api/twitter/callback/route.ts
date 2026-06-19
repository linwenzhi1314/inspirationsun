import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/twitter';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL('/admin?error=twitter_auth_failed', request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/admin?error=no_code', request.url)
      );
    }

    // 交换授权码获取访问令牌
    const tokenData = await exchangeCodeForToken(code);

    // 存储 token 到数据库
    const client = getSupabaseClient();

    // 检查是否已有 profile 记录
    const { data: existingProfile } = await client
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existingProfile) {
      // 更新现有记录
      const { error: updateError } = await client
        .from('profiles')
        .update({
          twitter_access_token: tokenData.access_token,
          twitter_refresh_token: tokenData.refresh_token,
          twitter_token_expires_at: tokenData.expires_at
            ? new Date(tokenData.expires_at).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id);

      if (updateError) {
        throw new Error(`更新 Twitter token 失败: ${updateError.message}`);
      }
    } else {
      // 创建新记录
      const { error: insertError } = await client.from('profiles').insert({
        twitter_access_token: tokenData.access_token,
        twitter_refresh_token: tokenData.refresh_token,
        twitter_token_expires_at: tokenData.expires_at
          ? new Date(tokenData.expires_at).toISOString()
          : null,
      });

      if (insertError) {
        throw new Error(`存储 Twitter token 失败: ${insertError.message}`);
      }
    }

    return NextResponse.redirect(
      new URL('/admin?twitter=connected', request.url)
    );
  } catch (error) {
    console.error('Twitter OAuth 回调错误:', error);
    return NextResponse.redirect(
      new URL(`/admin?error=${encodeURIComponent(error instanceof Error ? error.message : '认证失败')}`, request.url)
    );
  }
}
