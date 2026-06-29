import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.COZE_SUPABASE_URL!,
  process.env.COZE_SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/pages/[slug] - 获取页面内容
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const key = `page_${slug}`;

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      slug,
      content: data?.value || null
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取页面内容失败' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pages/[slug] - 更新页面内容
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const key = `page_${slug}`;
    const body = await request.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json({ error: '缺少 content 字段' }, { status: 400 });
    }

    // 检查是否已存在
    const { data: existing } = await supabase
      .from('settings')
      .select('key')
      .eq('key', key)
      .single();

    if (existing) {
      // 更新
      const { error } = await supabase
        .from('settings')
        .update({ value: content, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // 插入
      const { error } = await supabase
        .from('settings')
        .insert({ key, value: content });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, slug, content });
  } catch (error) {
    return NextResponse.json(
      { error: '更新页面内容失败' },
      { status: 500 }
    );
  }
}
