import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('articles')
      .select('id, title, slug, excerpt, cover_image, category, published, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20);

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
