import { NextResponse } from 'next/server';
import { postTweet, refreshAccessToken } from '@/lib/twitter';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, text } = body;

    if (!articleId || !text) {
      return NextResponse.json(
        { error: '文章 ID 和推文内容不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 获取 Twitter token
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, twitter_access_token, twitter_refresh_token, twitter_token_expires_at')
      .limit(1)
      .maybeSingle();

    if (profileError) {
      throw new Error(`获取 Twitter 配置失败: ${profileError.message}`);
    }

    if (!profile?.twitter_access_token) {
      return NextResponse.json(
        { error: '请先连接 Twitter 账号' },
        { status: 400 }
      );
    }

    let accessToken = profile.twitter_access_token;

    // 检查 token 是否过期
    if (profile.twitter_token_expires_at) {
      const expiresAt = new Date(profile.twitter_token_expires_at).getTime();
      if (Date.now() >= expiresAt) {
        // Token 已过期，需要刷新
        if (!profile.twitter_refresh_token) {
          return NextResponse.json(
            { error: 'Twitter 授权已过期，请重新连接' },
            { status: 400 }
          );
        }

        const newTokenData = await refreshAccessToken(profile.twitter_refresh_token);
        accessToken = newTokenData.access_token;

        // 更新数据库中的 token
        const { error: updateError } = await client
          .from('profiles')
          .update({
            twitter_access_token: newTokenData.access_token,
            twitter_refresh_token: newTokenData.refresh_token,
            twitter_token_expires_at: newTokenData.expires_at
              ? new Date(newTokenData.expires_at).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error('更新 Twitter token 失败:', updateError);
        }
      }
    }

    // 发布推文
    const tweet = await postTweet(accessToken, text);

    // 更新文章记录，标记已同步到 Twitter
    const { error: updateArticleError } = await client
      .from('articles')
      .update({
        twitter_post_id: tweet.id,
        twitter_posted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', articleId);

    if (updateArticleError) {
      console.error('更新文章记录失败:', updateArticleError);
    }

    return NextResponse.json({
      success: true,
      tweetId: tweet.id,
      tweetText: tweet.text,
    });
  } catch (error) {
    console.error('发布推文错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '发布推文失败' },
      { status: 500 }
    );
  }
}
