import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('articles')
      .select('id, title, slug, excerpt, category, published, created_at, updated_at, twitter_post_id')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`获取文章列表失败: ${error.message}`);
    }

    return NextResponse.json({ articles: data });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, cover_image, category, published, sync_to_twitter } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: '标题、链接和内容不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 检查 slug 是否已存在
    const { data: existingArticle } = await client
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existingArticle) {
      return NextResponse.json(
        { error: '该链接别名已存在，请使用其他名称' },
        { status: 400 }
      );
    }

    // 插入文章
    const { data, error } = await client
      .from('articles')
      .insert({
        title,
        slug,
        content,
        excerpt,
        cover_image,
        category: category || 'signal_capture',
        published,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`保存文章失败: ${error.message}`);
    }

    // 如果需要同步到 Twitter 且已发布
    if (sync_to_twitter && published && data) {
      try {
        // 构建 Twitter 推文内容
        const tweetText = `${title}\n\n${excerpt || content.substring(0, 200)}\n\n阅读更多: ${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/articles/${slug}`;

        // 调用 Twitter 发布 API
        const tweetResponse = await fetch(
          `${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/api/twitter/tweet`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              articleId: data.id,
              text: tweetText.substring(0, 280), // Twitter 字符限制
            }),
          }
        );

        if (!tweetResponse.ok) {
          console.error('同步到 Twitter 失败');
        }
      } catch (twitterError) {
        console.error('同步到 Twitter 错误:', twitterError);
        // 不影响文章保存，只记录错误
      }
    }

    return NextResponse.json({ article: data });
  } catch (error) {
    console.error('保存文章错误:', error);
    return NextResponse.json(
      { error: '保存文章失败' },
      { status: 500 }
    );
  }
}
